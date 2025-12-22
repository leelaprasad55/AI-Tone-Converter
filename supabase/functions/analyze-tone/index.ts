import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CULTURAL_CONTEXTS: Record<string, string> = {
  EN: "Use direct communication. Be clear and concise.",
  HI: "Indian English: Use respectful language, soften criticism, acknowledge hierarchy.",
  ES: "Spanish: Warm and personal, maintain politeness, use formal 'usted' when appropriate.",
  FR: "French: Formal and elegant, maintain professional distance, use proper titles.",
  DE: "German: Direct and precise, focus on facts, maintain professional tone.",
  PT: "Portuguese: Warm and friendly, maintain personal connection.",
  ZH: "Chinese: Respectful and indirect, preserve face, use humble language.",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language, audience, contentMedium, action, toneAdjustments } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const culturalContext = CULTURAL_CONTEXTS[language] || CULTURAL_CONTEXTS.EN;

    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'analyze') {
      systemPrompt = `You are an expert emotional intelligence analyzer. Analyze text for tone and emotion with high accuracy.
      
Cultural Context: ${culturalContext}
Audience: ${audience}
Medium: ${contentMedium}

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks.`;

      userPrompt = `Analyze this ${language} text for emotional intelligence:

"${text}"

Return JSON with this exact structure:
{
  "passive_agg_score": <0-100>,
  "sarcasm_score": <0-100>,
  "empathy_score": <0-100>,
  "formality_score": <0-100>,
  "aggression_score": <0-100>,
  "severity": "<high|medium|low>",
  "emotion_flags": ["<detected emotions>"],
  "analysis_summary": "<brief 2-sentence analysis>",
  "key_phrases": ["<problematic phrases if any>"]
}`;
    } else if (action === 'rewrite') {
      systemPrompt = `You are an expert diplomatic communication writer. Rewrite text to remove negative tones while preserving the original intent 100%.

Cultural Context: ${culturalContext}
Audience: ${audience}
Medium: ${contentMedium}

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks.`;

      const adjustmentInstructions = toneAdjustments 
        ? `
Specific tone adjustments requested:
- Passive-aggressive: reduce by ${100 - toneAdjustments.passive_agg}%
- Sarcasm: reduce by ${100 - toneAdjustments.sarcasm}%
- Empathy: increase to ${toneAdjustments.empathy}%
- Formality: adjust to ${toneAdjustments.formality}%`
        : '';

      userPrompt = `Rewrite this text to be diplomatic and professional:

ORIGINAL:
"${text}"
${adjustmentInstructions}

Return JSON with:
{
  "rewritten_text": "<the diplomatic rewrite>",
  "changes_summary": "<what was changed and why>",
  "intent_preserved_confidence": <0-100>,
  "new_scores": {
    "passive_agg_score": <0-100>,
    "sarcasm_score": <0-100>,
    "empathy_score": <0-100>,
    "formality_score": <0-100>,
    "aggression_score": <0-100>
  }
}`;
    }

    console.log(`Processing ${action} request for ${language} text...`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    let result;
    try {
      // Clean up the response in case it has markdown code blocks
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid AI response format');
    }

    console.log(`${action} completed successfully`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-tone function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

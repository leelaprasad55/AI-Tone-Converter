import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CULTURAL_CONTEXTS: Record<string, string> = {
  EN: "Use direct communication. Be clear and concise. American/British professional standards.",
  HI: "Indian English: Use respectful language, soften criticism, acknowledge hierarchy. Use 'ji' for respect where appropriate.",
  ES: "Spanish: Warm and personal, maintain politeness, use formal 'usted' when appropriate. Latin warmth.",
  FR: "French: Formal and elegant, maintain professional distance, use proper titles and vous form.",
  DE: "German: Direct and precise, focus on facts, maintain professional tone. Sachlich approach.",
  PT: "Portuguese: Warm and friendly, maintain personal connection. Brazilian or Portuguese style.",
  ZH: "Chinese: Respectful and indirect, preserve face, use humble language. Relationship-focused.",
};

const AUDIENCE_STYLES: Record<string, string> = {
  boss: "Professional and respectful. Acknowledge authority while being confident. Solution-oriented.",
  client: "Service-oriented and accommodating. Focus on value and partnership.",
  peer: "Collaborative and friendly. Equal footing, supportive tone.",
  HR: "Formal and policy-aware. Professional, documented approach.",
  general: "Neutral professional tone suitable for any audience.",
  investor: "Confident and data-driven. Focus on ROI, metrics, and strategic value.",
  team: "Supportive and motivating. Clear direction with encouragement.",
  vendor: "Professional and transactional. Clear expectations and terms.",
  partner: "Collaborative and mutually beneficial. Win-win framing.",
  customer: "Helpful and solution-focused. Empathetic to their needs.",
};

const UNIQUENESS_TECHNIQUES = [
  "Use varied sentence structures - mix short punchy sentences with longer explanatory ones",
  "Employ active voice predominantly for clarity and directness",
  "Include transitional phrases that feel natural, not formulaic",
  "Vary paragraph lengths for visual and cognitive rhythm",
  "Use specific, concrete language instead of vague generalities",
  "Incorporate the writer's apparent intent with fresh phrasing",
  "Avoid clichés and overused business jargon",
  "Make the tone feel human and authentic, not robotic",
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language, audience, contentMedium, action, toneAdjustments } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service is not configured');
    }

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Text is required for analysis');
    }

    const culturalContext = CULTURAL_CONTEXTS[language] || CULTURAL_CONTEXTS.EN;
    const audienceStyle = AUDIENCE_STYLES[audience] || AUDIENCE_STYLES.general;
    
    // Generate a unique seed for variety
    const uniqueSeed = Date.now() % 1000;

    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'analyze') {
      systemPrompt = `You are an expert emotional intelligence analyzer with deep expertise in communication psychology and cultural nuances. Your analysis must be precise, insightful, and actionable.

Cultural Context: ${culturalContext}
Target Audience: ${audience} - ${audienceStyle}
Content Medium: ${contentMedium}

CRITICAL RULES:
1. Return ONLY valid JSON - no markdown, no code blocks, no explanations outside JSON
2. Be nuanced - scores should rarely be 0 or 100 unless text is extreme
3. Consider context and intent, not just words
4. Identify subtle emotional undertones`;

      userPrompt = `Analyze this ${language} text for emotional intelligence and tone:

TEXT TO ANALYZE:
"${text}"

Provide a comprehensive JSON analysis:
{
  "passive_agg_score": <0-100, where 0=none, 50=moderate, 100=severe>,
  "sarcasm_score": <0-100, detect irony, mockery, eye-roll tone>,
  "empathy_score": <0-100, understanding and compassion shown>,
  "formality_score": <0-100, 0=very casual, 100=highly formal>,
  "aggression_score": <0-100, direct hostility or anger>,
  "defensiveness_score": <0-100, self-protective justifications>,
  "condescension_score": <0-100, talking down, patronizing>,
  "manipulation_score": <0-100, guilt-tripping, emotional control>,
  "dismissiveness_score": <0-100, ignoring or belittling>,
  "anxiety_score": <0-100, nervous energy, over-explaining>,
  "severity": "<high if any negative score >70, medium if >40, low otherwise>",
  "emotion_flags": ["<list 2-4 primary emotions detected>"],
  "analysis_summary": "<2-3 sentences explaining the overall emotional tone and potential impact on ${audience}>",
  "key_phrases": ["<up to 3 specific phrases that contribute most to the tone>"]
}

SCORING CALIBRATION:
- 0-20: Minimal/absent
- 21-40: Slight presence
- 41-60: Moderate/noticeable  
- 61-80: Strong presence
- 81-100: Dominant/severe`;

    } else if (action === 'rewrite') {
      systemPrompt = `You are an expert diplomatic communication writer. Your rewrites must be CONCISE, NATURAL, and EFFECTIVE.

Cultural Context: ${culturalContext}
Target Audience: ${audience} - ${audienceStyle}
Content Medium: ${contentMedium}

CRITICAL CONCISENESS RULES:
1. Keep the rewrite SHORT - aim for same length or shorter than original
2. Remove unnecessary words, filler phrases, and over-explanations
3. One clear point per sentence
4. No excessive pleasantries or padding
5. Be direct while remaining diplomatic
6. Cut wordiness ruthlessly - every word must earn its place

STYLE RULES:
1. Return ONLY valid JSON - no markdown, no code blocks
2. Preserve 100% of the original INTENT and key information
3. Transform the TONE, not pad the message
4. Sound professional and human, never verbose`;

      const adjustmentInstructions = toneAdjustments 
        ? `
TARGET TONE (adjust toward these):
- Passive-aggressive: ${toneAdjustments.passive_agg_score}% | Sarcasm: ${toneAdjustments.sarcasm_score}%
- Empathy: ${toneAdjustments.empathy_score}% | Formality: ${toneAdjustments.formality_score}%
- Aggression: ${toneAdjustments.aggression_score}% | Defensiveness: ${toneAdjustments.defensiveness_score || 10}%
- Condescension: ${toneAdjustments.condescension_score || 5}% | Dismissiveness: ${toneAdjustments.dismissiveness_score || 5}%`
        : `
DEFAULT GOALS: Remove passive-aggression, sarcasm, hostility. Add empathy. Match formality to ${contentMedium}.`;

      userPrompt = `Transform this into a SHORT, diplomatic message. Keep it CONCISE - same length or shorter than original.

ORIGINAL (${text.split(/\s+/).length} words):
"${text}"

${adjustmentInstructions}

REQUIREMENTS:
1. CONCISE: Same word count or fewer - no padding
2. Keep all facts and requests
3. Fix tone, don't add fluff
4. Appropriate for ${audience}

Return JSON:
{
  "rewritten_text": "<SHORT diplomatic rewrite - no longer than original>",
  "changes_summary": "<1 sentence on key changes>",
  "intent_preserved_confidence": <85-100>,
  "new_scores": {
    "passive_agg_score": <0-100>,
    "sarcasm_score": <0-100>,
    "empathy_score": <0-100>,
    "formality_score": <0-100>,
    "aggression_score": <0-100>,
    "defensiveness_score": <0-100>,
    "condescension_score": <0-100>,
    "manipulation_score": <0-100>,
    "dismissiveness_score": <0-100>,
    "anxiety_score": <0-100>
  }
}`;
    } else {
      throw new Error(`Invalid action: ${action}`);
    }

    console.log(`Processing ${action} request for ${language} text (${text.length} chars) for ${audience}...`);

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
        temperature: 0.7, // Add some creativity for unique outputs
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
      console.error('No content in AI response:', JSON.stringify(data));
      throw new Error('No response from AI');
    }

    // Parse the JSON response with robust cleaning
    let result;
    try {
      // Clean up the response - remove markdown, code blocks, and extra whitespace
      let cleanContent = content
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .replace(/^\s*[\r\n]+/, '')
        .trim();
      
      // Find the JSON object
      const jsonStart = cleanContent.indexOf('{');
      const jsonEnd = cleanContent.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanContent = cleanContent.slice(jsonStart, jsonEnd + 1);
      }
      
      result = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      console.error('Parse error:', parseError);
      throw new Error('Invalid AI response format');
    }

    // Validate required fields based on action
    if (action === 'analyze') {
      const requiredFields = ['passive_agg_score', 'sarcasm_score', 'empathy_score', 'formality_score', 'severity'];
      for (const field of requiredFields) {
        if (result[field] === undefined) {
          console.error(`Missing required field: ${field}`);
          throw new Error(`Invalid response: missing ${field}`);
        }
      }
    } else if (action === 'rewrite') {
      if (!result.rewritten_text) {
        console.error('Missing rewritten_text in response');
        throw new Error('Invalid response: missing rewritten_text');
      }
    }

    console.log(`${action} completed successfully for ${audience}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-tone function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred. Please try again.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

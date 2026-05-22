import importlib
from django.conf import settings


def _get_genai_module():
    return importlib.import_module('google.generativeai')


def get_gemini_model():
    api_key = getattr(settings, 'GEMINI_API_KEY', None)
    if not api_key:
        raise RuntimeError('GEMINI_API_KEY is not configured')

    genai = _get_genai_module()
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-1.5-flash')


def generative_ai_response(prompt):
    try:
        model = get_gemini_model()
        response = model.generate_content(prompt)
        return getattr(response, 'text', '') or ''
    except Exception as exc:
        raise RuntimeError(f'AI service error: {exc}') from exc

import importlib
from django.conf import settings


def _get_genai_module():
    return importlib.import_module('google.generativeai')


def get_gemini_model():
    api_key = getattr(settings, 'GEMINI_API_KEY', None)
    if not api_key:
        return None

    genai = _get_genai_module()
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(
        'gemini-1.5-flash',
        system_instruction=(
            'You are a professional career coach AI. Answer in a concise, positive, and practical tone. '
            'Provide actionable advice for resumes, cover letters, interviews, job search strategies, and career planning. '
            'When possible, include examples, formatting tips, and clear next steps.'
        ),
    )


def _build_conversation(message, history=None):
    history = history or []
    lines = []
    for item in history:
        role = item.get('role', 'user')
        text = (item.get('text') or '').strip()
        if not text:
            continue
        if role == 'assistant':
            lines.append(f'Assistant: {text}')
        else:
            lines.append(f'User: {text}')
    lines.append(f'User: {message}')
    lines.append('Assistant:')
    return '\n'.join(lines)


def fallback_ai_response(prompt):
    text = prompt.lower()
    if 'resume' in text:
        return (
            'I can help you improve your resume. Share your experience, skills, and the job you are applying for, '
            'and I will recommend stronger wording, focus areas, and formatting tips.'
        )
    if 'cover letter' in text or 'cover' in text:
        return (
            'I can help you draft a cover letter. Tell me the job title, company, and a little about your background, '
            'and I will generate a professional letter for you.'
        )
    if 'interview' in text:
        return (
            'I can help you prepare for interviews. Ask for practice questions, answers, or tips for technical and behavioral '
            'interview performance.'
        )
    if 'job' in text or 'matching' in text or 'career' in text:
        return (
            'I can help you find career direction, recommend job search strategies, and suggest how to match your skills to open roles.'
        )
    return (
        'I am your career assistant. Ask me about resumes, cover letters, interview prep, or job search help, '
        'and I will respond with guidance.'
    )


def generative_ai_response(message, history=None):
    history = history or []
    try:
        model = get_gemini_model()
        if model is None:
            return fallback_ai_response(message)

        chat = model.start_chat()
        conversation = _build_conversation(message, history)
        response = chat.send_message(conversation)

        if hasattr(response, 'text') and response.text:
            return response.text.strip()

        if isinstance(response, dict):
            text = response.get('text')
            if text:
                return text.strip()

        return fallback_ai_response(message)
    except Exception:
        return fallback_ai_response(message)

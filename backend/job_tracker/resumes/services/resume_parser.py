import re
from pathlib import Path

import docx
from PyPDF2 import PdfReader

SKILL_KEYWORDS = [
    'python', 'java', 'javascript', 'react', 'angular', 'sql', 'excel',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'node', 'django',
    'flask', 'html', 'css', 'typescript', 'c++', 'c#', 'git', 'leadership',
    'communication', 'management', 'analyst', 'data', 'machine learning',
    'project', 'agile', 'scrum', 'salesforce', 'marketing', 'accounting',
    'research', 'customer', 'support', 'design', 'ux', 'ui'
]

EMAIL_REGEX = re.compile(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}')
PHONE_REGEX = re.compile(r'(?:\+?\d[\d\s\-().]{7,}\d)')
EDUCATION_REGEX = re.compile(
    r'\b(bachelor|master|bs|bsc|ba|mba|msc|phd|doctorate|associate|university|college)\b',
    re.IGNORECASE,
)


def _extract_text_from_docx(file_path):
    document = docx.Document(file_path)
    paragraphs = [p.text for p in document.paragraphs if p.text and p.text.strip()]
    return '\n'.join(paragraphs)


def _extract_text_from_pdf(file_path):
    reader = PdfReader(file_path)
    text_blocks = []
    for page in reader.pages:
        page_text = page.extract_text() or ''
        text_blocks.append(page_text)
    return '\n'.join(text_blocks)


def _normalize_text(text):
    return re.sub(r'\s+', ' ', text).strip()


def _get_first_non_empty_line(text):
    for line in text.splitlines():
        line = line.strip()
        if line:
            return line
    return ''


def _extract_headline(text):
    if not text:
        return ''
    first_line = _get_first_non_empty_line(text)
    if len(first_line.split()) <= 12:
        return first_line
    return ' '.join(first_line.split()[:12])


def _extract_summary(text):
    if not text:
        return ''
    sentences = re.split(r'(?<=[.!?])\s+', text)
    summary_sentences = [s.strip() for s in sentences if s.strip()]
    if not summary_sentences:
        return _get_first_non_empty_line(text)
    return ' '.join(summary_sentences[:3])


def _extract_skills(text):
    text_lower = text.lower()
    found = []
    for keyword in SKILL_KEYWORDS:
        if keyword in text_lower and keyword not in found:
            found.append(keyword)
    return found[:20]


def _extract_contact_info(text):
    emails = EMAIL_REGEX.findall(text)
    phones = PHONE_REGEX.findall(text)
    contact_parts = []
    if emails:
        contact_parts.append('Email: ' + emails[0])
    if phones:
        contact_parts.append('Phone: ' + phones[0].strip())
    return ' | '.join(contact_parts)


def _extract_education(text):
    matches = EDUCATION_REGEX.findall(text)
    if not matches:
        return ''
    return ' '.join(list(dict.fromkeys(match.title() for match in matches)))


def _extract_experience(text):
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    experience_lines = [line for line in lines if re.search(r'\bexperience\b|\bworked\b|\bprojects\b|\bachieved\b|\bmanaged\b', line, re.IGNORECASE)]
    if experience_lines:
        return ' '.join(experience_lines[:3])
    return ' '.join(lines[:4])


def parse_resume(file_path):
    path = Path(file_path)
    suffix = path.suffix.lower()
    if suffix == '.pdf':
        text = _extract_text_from_pdf(file_path)
    elif suffix == '.docx':
        text = _extract_text_from_docx(file_path)
    else:
        raise ValueError('Unsupported resume format. Please upload a PDF or DOCX file.')

    text = _normalize_text(text)

    return {
        'parsed_text': text,
        'headline': _extract_headline(text),
        'summary': _extract_summary(text),
        'skills': _extract_skills(text),
        'experience': _extract_experience(text),
        'education': _extract_education(text),
        'contact_info': _extract_contact_info(text),
    }

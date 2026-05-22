export const stripHtml = (html = '') => {
  if (typeof html !== 'string') {
    return '';
  }

  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

export const truncateText = (text = '', length = 120) => {
  const cleaned = stripHtml(text).trim();
  return cleaned.length > length ? `${cleaned.slice(0, length).trim()}...` : cleaned;
};

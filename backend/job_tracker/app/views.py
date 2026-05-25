from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services.ai_service import generative_ai_response

@api_view(['POST'])
def chatbot_view(request):
    message = (request.data.get('message') or '').strip()
    history = request.data.get('history', [])

    if not message:
        return Response({'reply': 'Please send a message to get help.'}, status=400)

    if not isinstance(history, list):
        history = []

    try:
        response = generative_ai_response(message, history=history)
        return Response({'reply': response})
    except Exception as exc:
        return Response(
            {
                'reply': 'Unable to reach the AI service. Please try again shortly.',
                'detail': str(exc),
            },
            status=500,
        )

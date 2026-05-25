from rest_framework import serializers
from .models import Resume
from .services.resume_parser import parse_resume


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'
        read_only_fields = [
            'parsed_text',
            'headline',
            'summary',
            'skills',
            'experience',
            'education',
            'contact_info',
            'uploaded_at',
            'user',
        ]

    def create(self, validated_data):
        resume_instance = super().create(validated_data)
        try:
            parsed_data = parse_resume(resume_instance.resume.path)
            for key, value in parsed_data.items():
                setattr(resume_instance, key, value)
            resume_instance.save()
        except Exception:
            pass
        return resume_instance
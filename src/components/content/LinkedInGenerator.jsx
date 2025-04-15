// src/components/content/LinkedInGenerator.jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ContentForm from './ContentForm';

// Esquema de validación para el formulario
const linkedInFormSchema = z.object({
  prompt: z.string().min(3, 'Por favor ingresa al menos 3 caracteres'),
  contentType: z.enum(['post', 'article', 'poll', 'document'], {
    required_error: 'Selecciona un tipo de contenido',
  }),
  goal: z.enum(['awareness', 'engagement', 'leads', 'conversion', 'education'], {
    required_error: 'Selecciona un objetivo',
  }),
  tone: z.enum(['professional', 'conversational', 'inspirational', 'educational'], {
    required_error: 'Selecciona un tono',
  }),
  includeHashtags: z.boolean().default(true),
  includeCTA: z.boolean().default(true),
});

// Configuración de campos avanzados para LinkedIn
const linkedInAdvancedFields = {
  contentTypes: [
    { id: 'post', label: 'Post estándar' },
    { id: 'article', label: 'Artículo' },
    { id: 'poll', label: 'Encuesta' },
    { id: 'document', label: 'Documento' },
  ],
  goals: [
    { value: 'awareness', label: 'Aumentar visibilidad de marca' },
    { value: 'engagement', label: 'Maximizar interacción' },
    { value: 'leads', label: 'Generación de leads' },
    { value: 'conversion', label: 'Conversión directa' },
    { value: 'education', label: 'Educar a la audiencia' },
  ],
  tones: [
    { value: 'professional', label: 'Profesional y formal' },
    { value: 'conversational', label: 'Conversacional y cercano' },
    { value: 'inspirational', label: 'Inspirador y motivador' },
    { value: 'educational', label: 'Educativo e informativo' },
  ],
  options: [
    { id: 'hashtags', name: 'includeHashtags', label: 'Incluir hashtags' },
    { id: 'cta', name: 'includeCTA', label: 'Incluir llamado a la acción' },
  ]
};

// Sugerencias rápidas para LinkedIn
const linkedInSuggestions = [
  'Estrategia digital', 
  'Liderazgo', 
  'Innovación',
  'Tendencias 2025', 
  'Productividad', 
  'Trabajo remoto'
];

export default function LinkedInGenerator({ prompt, setPrompt, isGenerating, onSubmit }) {
  // Configurar react-hook-form con validación zod
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(linkedInFormSchema),
    defaultValues: {
      prompt: prompt || '',
      contentType: 'post',
      goal: 'engagement',
      tone: 'professional',
      includeHashtags: true,
      includeCTA: true,
    },
  });

  return (
    <ContentForm
      platform="linkedin"
      prompt={prompt}
      setPrompt={setPrompt}
      isGenerating={isGenerating}
      onSubmit={onSubmit}
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      advancedFields={linkedInAdvancedFields}
      suggestions={linkedInSuggestions}
      buttonText="Generar contenido para LinkedIn"
    />
  );
}

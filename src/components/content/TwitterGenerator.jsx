// src/components/content/TwitterGenerator.jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ContentForm from './ContentForm';

// Esquema de validación para el formulario
const twitterFormSchema = z.object({
  prompt: z.string().min(3, 'Por favor ingresa al menos 3 caracteres'),
  contentType: z.enum(['tweet', 'thread', 'poll'], {
    required_error: 'Selecciona un tipo de contenido',
  }),
  goal: z.enum(['viral', 'engagement', 'awareness', 'traffic', 'opinion'], {
    required_error: 'Selecciona un objetivo',
  }),
  tone: z.enum(['casual', 'informative', 'humorous', 'controversial'], {
    required_error: 'Selecciona un tono',
  }),
  includeHashtags: z.boolean().default(true),
  includeCTA: z.boolean().default(true),
  includeEmojis: z.boolean().default(true),
});

// Configuración de campos avanzados para Twitter
const twitterAdvancedFields = {
  contentTypes: [
    { id: 'tweet', label: 'Tweet único' },
    { id: 'thread', label: 'Hilo' },
    { id: 'poll', label: 'Encuesta' },
  ],
  goals: [
    { value: 'viral', label: 'Maximizar viralidad' },
    { value: 'engagement', label: 'Generar conversación' },
    { value: 'awareness', label: 'Aumentar visibilidad' },
    { value: 'traffic', label: 'Dirigir tráfico' },
    { value: 'opinion', label: 'Compartir opinión' },
  ],
  tones: [
    { value: 'casual', label: 'Casual y conversacional' },
    { value: 'informative', label: 'Informativo y educativo' },
    { value: 'humorous', label: 'Humorístico' },
    { value: 'controversial', label: 'Provocativo (debate)' },
  ],
  options: [
    { id: 'hashtags', name: 'includeHashtags', label: 'Hashtags' },
    { id: 'cta', name: 'includeCTA', label: 'Llamado a la acción' },
    { id: 'emojis', name: 'includeEmojis', label: 'Emojis' },
  ]
};

// Sugerencias rápidas para Twitter
const twitterSuggestions = [
  'Pregunta controversial', 
  'Dato sorprendente', 
  'Consejo práctico',
  'Opinión del sector', 
  'Predicción', 
  'Reflexión personal'
];

export default function TwitterGenerator({ prompt, setPrompt, isGenerating, onSubmit }) {
  // Configurar react-hook-form con validación zod
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(twitterFormSchema),
    defaultValues: {
      prompt: prompt || '',
      contentType: 'tweet',
      goal: 'engagement',
      tone: 'casual',
      includeHashtags: true,
      includeCTA: true,
      includeEmojis: true,
    },
  });

  return (
    <ContentForm
      platform="twitter"
      prompt={prompt}
      setPrompt={setPrompt}
      isGenerating={isGenerating}
      onSubmit={onSubmit}
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      advancedFields={twitterAdvancedFields}
      suggestions={twitterSuggestions}
      buttonText="Generar tweet"
    />
  );
}

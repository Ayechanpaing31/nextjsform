// ProjectForm.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import type Form from '~/types/Form';
import FormFilling from '../components/FormFilling';

const ProjectForm: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      if (!session?.user) {
        router.push('/');
      }
    };
    fetchData();
  }, []);

  const [formData] = useState<Form>({
    id: '',
    workout_title: '',
    completion_date: new Date(),
    workout_type: 'cardio',
    checkboxes: [],
    Others_option: '',
    updates: '',
    difficulty_rating: 0,
    ongoing: false,
    form_image: '',
  });

  const formsCreateMutation = api.form.formsCreate.useMutation();

  const handleCreateForm = async (formData: Form) => {
    try {
      await formsCreateMutation.mutateAsync({
        workout_title: formData.workout_title,
        completion_date: formData.completion_date,
        workout_type: formData.workout_type,
        checkboxes: formData.checkboxes,
        updates: formData.updates,
        difficulty_rating: formData.difficulty_rating,
        ongoing: formData.ongoing,
        form_image: formData.form_image,
      }).then((result) => {
        router.push('/home');
      });
    } catch (err) {
      console.error('Error creating form:', err);
    }
  };


  return (
    <FormFilling
      initialFormData={formData}
      onSubmit={handleCreateForm}
    />
  );
};

export default ProjectForm;

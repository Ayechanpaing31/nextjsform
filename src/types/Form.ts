interface Form {
  id: string;
  workout_title: string;
  completion_date: Date;
  workout_type: string;
  checkboxes: string[];
  updates: string;
  Others_option?: string;
  difficulty_rating: number;
  ongoing: boolean;
  form_image: string;
}

export default Form;

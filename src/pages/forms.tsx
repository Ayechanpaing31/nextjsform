import type Form from "~/types/Form";
import React, { useState, useEffect } from "react";
import { default as FormViewer } from "~/components/Form";

const Forms = ({ forms }: { forms: Form[] }) => {
  const [localForms, setLocalForms] = useState<Form[] | null>(null);  
  const [isLoading, setIsLoading] = useState<boolean>(true);  

  useEffect(() => {
    if (forms) {
      setLocalForms(forms);
      setIsLoading(false);  
    }
  }, [forms]);

  const handleDeleteForm = (id: string) => {
    setLocalForms(prevForms => prevForms ? prevForms.filter(form => form.id !== id) : null);
  };

  if (isLoading) {
    return <div>Loading...</div>;  // Display a loading message
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-8 pt-12 max-w-7xl w-full">
        {(localForms ?? []).map((n) => (
          <FormViewer form={n} key={n.id} onDelete={() => handleDeleteForm(n.id)} />
        ))}
      </div>
    </>
  );
};

export default Forms;

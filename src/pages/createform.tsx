import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Head from "next/head";
import Header from "../components/Header";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import type Form from '~/types/Form';
import { UploadDropzone } from "~/utils/uploadthing";
import "@uploadthing/react/styles.css";
import Link from 'next/link';


const ProjectForm: React.FC = () => {
  const { data: sessionData, status } = useSession();
  const [formData, setFormData] = useState<Form>({
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
  const router = useRouter();
  const formsCreateMutation = api.form.formsCreate.useMutation();
  const handleCreateForm = async () => {
    try {
      await formsCreateMutation.mutateAsync({
        workout_title: formData.workout_title,
        completion_date: formData.completion_date,
        workout_type: formData.workout_type,
        checkboxes: formData.checkboxes,
        updates: formData.updates,
        difficulty_rating: formData.difficulty_rating,
        ongoing: formData.ongoing,
        form_image: formData.form_image,  // Provide the File directly
      }).then((result) => {
        router.push('/home'); // Navigate back to the index page
      });
    } catch (err) {
      console.error("Error creating form:", err);
    }
  };
  const handleUploadComplete = (res: any) => {
    // Assuming that the response contains the image URL
    const imageUrl = res?.[0]?.url || ''; // Adjust this based on the actual response structure
    // Update the form data with the image URL
    setFormData((prevData) => ({
      ...prevData,
      form_image: imageUrl || '', // Use empty string if URL is not available
    }));
    // Additional logic or state updates if needed
    alert('Upload Completed');
  };
  const handleUploadError = (error: Error) => {
    // Handle the error as needed
    alert(`ERROR! ${error.message}`);
  };


  const [updatesOption, setUpdatesOption] = useState('no'); // Maintain a separate state for radio button selection
  const [othersOptionInput, setOthersOptionInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Update the placeholder title in h2 when the workout_title changes
    if (name === 'workout_title') {
      setFormData((prevData) => ({ ...prevData, workout_title: value }));
    }

    if (name === 'updates') {
      setUpdatesOption(value); // Update the separate state for radio button selection
      if (value === 'Others') {
        setOthersOptionInput(formData.Others_option ?? ''); // Use an empty string if Others_option is undefined
        setFormData((prevData) => ({ ...prevData, updates: 'Others' }));
      } else {
        setFormData((prevData) => ({ ...prevData, updates: value }));
      }
    } else if (name === 'Others_option') {
      setOthersOptionInput(value);
      // Update 'updates' when Others_option changes (if 'Others' is selected)
      if (updatesOption === 'Others') {
        setFormData((prevData) => ({ ...prevData, updates: value }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === 'difficulty_rating' ? parseInt(value, 10) : value,
      }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    // Handle date field separately
    if (type === 'date') {
      // Parse the date string and set it as a Date object
      setFormData((prevData) => ({ ...prevData, [name]: new Date(value) }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };



  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData((prevData) => {
      // If the checkbox is checked, add the muscle group to the array
      // If it's unchecked, remove it from the array
      const updatedcheckboxes = checked
        ? [...prevData.checkboxes, name]
        : prevData.checkboxes.filter((group) => group !== name);

      return { ...prevData, checkboxes: updatedcheckboxes };
    });
  };
  const handleOngoingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      ongoing: e.target.checked,
    }));
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    handleCreateForm();
    console.log('Form data submitted:', formData);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default behavior of the Enter key
    }
  };


  return (
    <>
      {sessionData ? (
        <>
      <Head>
        <title>Home | Create a form</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <div className="flex justify-center items-center py-7 mx-10">
        <form className="w-2/3 space-y-6" onSubmit={handleSubmit}>

          <div className="space-y-2 mt-5">
            <label className="text-4xl font-large bold leading-none" htmlFor="workout_title">
              {formData.workout_title || 'Workout Title'}
            </label>
            <input
              type="text"
              id="workout_title"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={`Enter ${formData.workout_title ? 'additional ' : ''}workout title`}
              name="workout_title"
              value={formData.workout_title}
              onChange={(e) => handleChange(e)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="space-y-2">
            <label className="text-lg font-bold leading-none" htmlFor="completion_date">
              Date of Workout Completed
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="completion_date"
                name="completion_date"
                value={formData.completion_date.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(e)}
                onKeyDown={handleKeyDown}
                className="w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Select completion date"
              />
            </div>
          </div>

          <div className="space-y-2 mt-5">
            <label className="text-lg font-bold leading-none" htmlFor="workout_type">
              Type of workout
            </label>
            <select
              id="workout_type"
              name="workout_type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.workout_type}
              onChange={(e) => handleChange(e)}
            >
              <option value="Cardio">Cardio</option>
              <option value="Weightlifting">Weightlifting</option>
              <option value="Bodybuilding">Bodybuilding</option>
              <option value="Crossfit">Crossfit</option>

            </select>
          </div>

          <div className="space-y-2 mt-5">
            <label className="text-lg font-bold leading-none">Muscles hit</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="Leg"
                  checked={formData.checkboxes.includes('Leg')}
                  onChange={(e) => handleCheckboxChange(e)}
                />
                Leg
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="Upper Body"
                  checked={formData.checkboxes.includes('Upper Body')}
                  onChange={(e) => handleCheckboxChange(e)}
                />
                Upper Body
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="Lower Body"
                  checked={formData.checkboxes.includes('Lower Body')}
                  onChange={(e) => handleCheckboxChange(e)}
                />
                Lower Body
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="Abs"
                  checked={formData.checkboxes.includes('Abs')}
                  onChange={(e) => handleCheckboxChange(e)}
                />
                Abs
              </label>
            </div>
          </div>

          <div className="space-y-2 mt-5">
            <label className="text-lg bold font-bold leading-none">Do you think this workout is easy? </label>
            <div className="flex flex-col">
              <label className="mb-2">
                <input
                  type="radio"
                  name="updates"
                  value="yes"
                  checked={formData.updates === 'yes'}
                  onChange={(e) => handleChange(e)}
                />
                Yes
              </label>
              <label className="mb-2">
                <input
                  type="radio"
                  name="updates"
                  value="no"
                  checked={formData.updates === 'no'}
                  onChange={(e) => handleChange(e)}
                />
                No
              </label>
              <label className="mb-2">
                <input
                  type="radio"
                  name="updates"
                  value="maybe"
                  checked={formData.updates === 'maybe'}
                  onChange={(e) => handleChange(e)}
                />
                Maybe
              </label>
              <label className="mb-2 flex items-center">
                <input
                  type="radio"
                  name="updates"
                  value="Others"
                  checked={updatesOption === 'Others'}
                  onChange={(e) => handleChange(e)}
                />
                <span className="ml-2">
                  {updatesOption === 'Others' ? (
                    <input
                      type="text"
                      id="Others_option"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter Others"
                      name="Others_option"
                      value={othersOptionInput}
                      onChange={(e) => handleChange(e)}
                      onKeyDown={handleKeyDown}
                    />
                  ) : (
                    'Others'
                  )}

                </span>
              </label>
            </div>
          </div>

          <div className="space-y-2 mt-5">
            <label className="text-lg mx-auto font-bold leading-none">Difficulty Rating</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                id="difficulty_rating"
                name="difficulty_rating"
                min="0"
                max="10"
                step="1"
                value={formData.difficulty_rating}
                onChange={(e) => handleChange(e)}
                className="w-full"
              />
              <span>{formData.difficulty_rating}</span>
            </div>
          </div>

          <div className="space-y-2 mt-5">
            <label className="flex items-center">
              <span className="relative text-lg font-bold">Would you do this workout again?</span>
              <input
                type="checkbox"
                name="ongoing"
                checked={formData.ongoing}
                onChange={(e) => handleOngoingChange(e)}
                className="sr-only"
              />
              <span
                className={`${formData.ongoing ? 'bg-gray-700' : 'bg-gray-300'
                  } relative ml-auto inline-block h-5 w-11  rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700`}
              >
                {/* Switch handle */}
                <span
                  className={`${formData.ongoing ? 'translate-x-5' : 'translate-x-0'
                    } inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition-transform ease-in-out duration-200`}
                />
              </span>
            </label>
          </div>

          <div className="space-y-2 mt-5">
            <label className="text-lg font-bold  leading-none" >
              Postworkout Selfie
            </label>
            <div>
              <UploadDropzone
                className="bg-slate-800 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
                endpoint="imageUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
              />
            </div>
          </div>


          <div className="flex items-center justify-center gap-x-3 mt-5">
            <Link className="inline-flex items-center justify-center rounded-md text-sm font-medium" href="/home">
              Discard
            </Link>
            <button
              className="inline-flex items-center border:2px justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              type="submit"
              onSubmit={handleSubmit} 
              onKeyDown={handleKeyDown}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      </>
      ) : (
        "href = /index"
      )}
      </>
  );
};

export default ProjectForm;
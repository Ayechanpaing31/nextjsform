import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from "next/head";
import Header from "../components/Header";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { UploadDropzone } from "~/utils/uploadthing";
import { boolean } from 'zod';
import type Form from '~/types/Form';
import "@uploadthing/react/styles.css";



const EditForm = ({ form, onDelete }: { form: Form, onDelete: () => void }) => {
    console.log('Form:', form);


    const { data: sessionData, status } = useSession();
    const [isEditing, setIsEditing] = useState<boolean>(true);
    const [data, setData] = useState<Form>({
        id: form?.id || "",
        workout_title: form?.workout_title || "",
        completion_date: form?.completion_date || new Date(),
        workout_type: form?.workout_type || "",
        checkboxes: form?.checkboxes || [],
        updates: form?.updates || "",
        Others_option: "", // Handle the updates field here
        difficulty_rating: form?.difficulty_rating || 0,
        ongoing: form?.ongoing || false,
        form_image: form?.form_image || "",
    });


    const router = useRouter();
    console.log("router.query:", router.query);
    const { id } = router.query;
    console.log("id:", id);
    const formContainer = useRef<HTMLDivElement>(null);
    const formDeleteMutation = api.form.formsDelete.useMutation();
    const formEditMutation = api.form.formsUpdate.useMutation({
        onSuccess: () => {
            router.push("/home")
          },
    });

    // Define a state to store the selected form data
    const [selectedForm, setSelectedForm] = useState<Form | null>(null);

    // Fetch the selected form data using useQuery
    const { data: selectedFormData } = id ? api.form.formSelectByID.useQuery({ id: id as string }) as { data: Form } : { data: null };

    useEffect(() => {
        // Update the state with the selected form data when it changes
        if (selectedFormData) {
            setSelectedForm(selectedFormData);
        }
    }, [selectedFormData]);

    // Initialize data based on the selectedForm or form prop
    useEffect(() => {
        const initialData = selectedForm || form;

        setData({
            id: initialData?.id,
            workout_title: initialData?.workout_title || "",
            completion_date: initialData?.completion_date || new Date(),
            workout_type: initialData?.workout_type || "",
            checkboxes: initialData?.checkboxes || [],
            updates: initialData?.updates || "",
            difficulty_rating: initialData?.difficulty_rating || 0,
            ongoing: initialData?.ongoing || false,
            form_image: initialData?.form_image || "",
        });
    }, [form, selectedForm]);

    const handleEditForm = useCallback(async () => {
        try {
            // Use the formEditMutation to update the form in the database
            const result = await formEditMutation.mutateAsync({
                id: data.id,
                workout_title: data.workout_title,
                completion_date: data.completion_date,
                workout_type: data.workout_type,
                checkboxes: data.checkboxes,
                updates: data.updates,
                difficulty_rating: data.difficulty_rating,
                ongoing: data.ongoing,
                form_image: data.form_image,
            });
    
            // Log the result if needed
            console.log(result);
    
            // Redirect to home page after successful submission
            router.push("/home");
        } catch (error) {
            console.error(error);
        }
    }, [data, formEditMutation, router]);

    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default behavior of the Enter key
        }
    };
    const handleDelete = async (id: string) => {
        console.log(id);
        try {
            await formDeleteMutation.mutateAsync({ id }).then((result) => {
                onDelete();
            });
        } catch (error) {
            console.error("Error deleting form:", error);
            //   toast.message("Error deleting form:" + error);
        }
    }
    const handleUploadComplete = (res: any) => {
        // Assuming that the response contains the image URL
        const imageUrl = res?.[0]?.url || ''; // Adjust this based on the actual response structure
        // Update the form data with the image URL
        setData((prevData) => ({
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
            setData((prevData) => ({ ...prevData, workout_title: value }));
        }

        if (name === 'updates') {
            setUpdatesOption(value); // Update the separate state for radio button selection
            if (value === 'Others') {
                setOthersOptionInput(data.Others_option || ''); // Use an empty string if Others_option is undefined
                setData((prevData) => ({ ...prevData, updates: 'Others' }));
            } else {
                setData((prevData) => ({ ...prevData, updates: value }));
            }
        } else if (name === 'Others_option') {
            setOthersOptionInput(value);
            // Update 'updates' when Others_option changes (if 'Others' is selected)
            if (updatesOption === 'Others') {
                setData((prevData) => ({ ...prevData, updates: value }));
            }
        } else {
            setData((prevData) => ({
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
            setData((prevData) => ({ ...prevData, [name]: new Date(value) }));
        } else {
            setData((prevData) => ({ ...prevData, [name]: value }));
        }
    };



    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        setData((prevData) => {
            // If the checkbox is checked, add the muscle group to the array
            // If it's unchecked, remove it from the array
            const updatedcheckboxes = checked
                ? [...prevData.checkboxes, name]
                : prevData.checkboxes.filter((group) => group !== name);

            return { ...prevData, checkboxes: updatedcheckboxes };
        });
    };
    const handleOngoingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prevData) => ({
            ...prevData,
            ongoing: e.target.checked,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'project_image' | 'project_brief') => {
        const files = e.target.files;
        setData((prevData) => ({ ...prevData, [fileType]: files }));
    };

    const submitForm = async (event: any) => {
        event.preventDefault();
        formEditMutation.mutate({
            id: data.id,
            workout_title: data.workout_title,
            completion_date: data.completion_date,
            workout_type: data.workout_type,
            checkboxes: data.checkboxes,
            updates: data.updates,
            difficulty_rating: data.difficulty_rating,
            ongoing: data.ongoing,
            form_image: data.form_image,
        })
    };



    return (
        <>
            {sessionData ? (
                <>
                    <Head>
                        <title>Home | Edit a form</title>
                        <meta name="description" content="Generated by create-t3-app" />
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    <Header />

                    <div className="flex justify-center items-center py-7 mx-10">
                        <form className="w-2/3 space-y-6">

                            <div className="space-y-2 mt-5">
                                <label className="text-4xl font-large bold leading-none" htmlFor="workout_title">
                                    {data.workout_title}
                                </label>
                                <input
                                    type="text"
                                    id="workout_title"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder={data.workout_title}
                                    name="workout_title"
                                    value={data.workout_title}
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
                                        value={data.completion_date.toISOString().split('T')[0]}
                                        disabled={!isEditing}
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
                                    value={data.workout_type}
                                    disabled={!isEditing}
                                    onChange={(e) => handleChange(e)}
                                >
                                    <option value="Cardio">Cardio</option>
                                    <option value="Weightlifting">Weightlifting</option>
                                    <option value="Bodylifting">Bodylifting</option>
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
                                            checked={data.checkboxes.includes('Leg')}
                                            onChange={(e) => handleCheckboxChange(e)}
                                            disabled={!isEditing}
                                        />
                                        Leg
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="Upper Body"
                                            checked={data.checkboxes.includes('Upper Body')}
                                            onChange={(e) => handleCheckboxChange(e)}
                                            disabled={!isEditing}
                                        />
                                        Upper Body
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="Lower Body"
                                            checked={data.checkboxes.includes('Lower Body')}
                                            onChange={(e) => handleCheckboxChange(e)}
                                            disabled={!isEditing}
                                        />
                                        Lower Body
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="Abs"
                                            checked={data.checkboxes.includes('Abs')}
                                            onChange={(e) => handleCheckboxChange(e)}
                                            disabled={!isEditing}
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
                                            checked={data.updates === 'yes'}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        Yes
                                    </label>
                                    <label className="mb-2">
                                        <input
                                            type="radio"
                                            name="updates"
                                            value="no"
                                            checked={data.updates === 'no'}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        No
                                    </label>
                                    <label className="mb-2">
                                        <input
                                            type="radio"
                                            name="updates"
                                            value="maybe"
                                            checked={data.updates === 'maybe'}
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
                                        value={data.difficulty_rating}
                                        onChange={(e) => handleChange(e)}
                                        className="w-full"
                                    />
                                    <span>{data.difficulty_rating}</span>
                                </div>
                            </div>

                            <div className="space-y-2 mt-5">
                                <label className="flex items-center">
                                    <span className="relative text-lg font-bold">Would you do this workout again?</span>
                                    <input
                                        type="checkbox"
                                        name="ongoing"
                                        checked={data.ongoing}
                                        onChange={(e) => handleOngoingChange(e)}
                                        className="sr-only"
                                    />
                                    <span
                                        className={`${data.ongoing ? 'bg-gray-700' : 'bg-gray-300'
                                            } relative ml-auto inline-block h-5 w-11  rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700`}
                                    >
                                        {/* Switch handle */}
                                        <span
                                            className={`${data.ongoing ? 'translate-x-5' : 'translate-x-0'
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
                                <a className="inline-flex items-center justify-center rounded-md text-sm font-medium" href="/home">
                                    Discard
                                </a>
                                <button
                                    className="inline-flex items-center border:2px justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                                    type="submit"
                                    onClick={() => handleDelete(form.id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="inline-flex items-center border:2px justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                                    type="submit"
                                    onClick={() => {
                                        handleEditForm();
                                        router.push("/home");
                                    }}
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
export default EditForm;

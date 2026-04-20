import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '', 
    deadline: '',
    image: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    const value = e.target.value;
    const newErrors = { ...errors };
    
    if (fieldName === 'target') {
      // Only allow numbers and decimal point
      if (value && !/^\d*\.?\d*$/.test(value)) {
        newErrors.target = 'Please enter a valid number';
      } else {
        delete newErrors.target;
      }
    } else if (fieldName === 'name') {
      // Name cannot be only numbers
      if (/^\d+$/.test(value)) {
        newErrors.name = 'Name cannot contain only numbers';
      } else {
        delete newErrors.name;
      }
    } else if (fieldName === 'title') {
      // Title cannot be only numbers
      if (/^\d+$/.test(value)) {
        newErrors.title = 'Title cannot contain only numbers';
      } else {
        delete newErrors.title;
      }
    } else if (fieldName === 'description') {
      // Word count for description Check
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < 50) {
        newErrors.description = `Story must be at least 50 words (current: ${wordCount})`;
      } else {
        delete newErrors.description;
      }
    } else if (fieldName === 'deadline') {
      // Deadline in the past Check
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.deadline = 'End date cannot be in the past';
      } else {
        delete newErrors.deadline;
      }
    }

    setForm({ ...form, [fieldName]: value });
    setErrors(newErrors);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newErrors = {};
      if (!form.name) {
        newErrors.name = 'Please enter your name';
      } else if (/^\d+$/.test(form.name)) {
        newErrors.name = 'Name cannot contain only numbers';
      }

      if (!form.title) {
        newErrors.title = 'Please enter a campaign title';
      } else if (/^\d+$/.test(form.title)) {
        newErrors.title = 'Title cannot contain only numbers';
      }

      if (!form.description) {
        newErrors.description = 'Please provide a campaign description';
      } else {
        const wordCount = form.description.trim().split(/\s+/).length;
        if (wordCount < 50) {
          newErrors.description = `Story must be at least 50 words (current: ${wordCount})`;
        }
      }

      if (!form.target) {
        newErrors.target = 'Please enter a funding goal';
      }

      if (!form.deadline) {
        newErrors.deadline = 'Please select an end date';
      } else {
        const selectedDate = new Date(form.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          newErrors.deadline = 'End date cannot be in the past';
        }
      }

      if (!form.image) {
        newErrors.image = 'Please provide an image URL';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast.error('Please fill in all required fields');
        return;
      }

      checkIfImage(form.image, async (exists) => {
        if (exists) {
          try {
            setIsLoading(true);
            const result = await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18) });
            if (result) {
              setIsLoading(false);
              toast.success('Campaign created successfully!');
              navigate(`/campaign-details/${result}`);
              return;
            }
          } catch (error) {
            if (error.message.toLowerCase().includes('user rejected') || 
                error.message.toLowerCase().includes('user denied') || 
                error.message.toLowerCase().includes('transaction error')) {
              toast.error('Transaction was rejected by user');
            } else if (error.message.includes('insufficient funds')) {
              toast.error('Insufficient funds in your wallet');
            } else {
              toast.error('Failed to create campaign. Please try again.');
              console.error('Campaign creation error:', error);
            }
          } finally {
            setIsLoading(false);
              setIsLoading(false);
              toast.success('Campaign created successfully!');
              navigate(`/profile`);
            

          }
        } else {
          toast.error('Please provide a valid image URL');
          setForm({ ...form, image: '' });
        }
      });
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Form submission error:', error);
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-[#111827] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 border border-[#1e293b] shadow-lg">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#1e293b] rounded-[10px] border border-[#374151]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
            error={errors.name}
          />
          <FormField 
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
            error={errors.title}
          />
        </div>

        <FormField 
            labelName="Story *"
            placeholder="Write your story"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange('description', e)}
            error={errors.description}
          />

        <div className="w-full flex justify-start items-center p-4 bg-[#3b82f6] h-[100px] rounded-[10px] shadow-md hover:bg-[#2563eb] transition-colors duration-200">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/>
          <h4 className="font-epilogue font-bold text-[20px] text-white ml-[10px]">You will get 100% of the raised amount</h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
            error={errors.target}
          />
          <FormField 
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
            error={errors.deadline}
          />
        </div>

        <FormField 
            labelName="Campaign image *"
            placeholder="Place image URL of your campaign"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange('image', e)}
            error={errors.image}
          />

          <div className="flex justify-center items-center mt-[40px]">
            <CustomButton 
              btnType="submit"
              title="Submit new campaign"
              styles="bg-[#3b82f6] hover:bg-[#2563eb] transition-colors duration-200"
            />
          </div>
      </form>
    </div>
  )
}

export default CreateCampaign
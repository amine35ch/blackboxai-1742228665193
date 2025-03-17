import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const MESSAGE_MAX_LENGTH = 500;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length > MESSAGE_MAX_LENGTH) {
      newErrors.message = `Message must be ${MESSAGE_MAX_LENGTH} characters or less`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Rate limiting - 30 seconds between submissions
    const now = Date.now();
    if (now - lastSubmitTime < 30000) {
      setSubmitStatus({
        type: 'error',
        message: 'Please wait 30 seconds before submitting again'
      });
      return;
    }

    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully.'
        });
        // Clear form
        setFormData({ name: '', email: '', phone: '', message: '' });
        setLastSubmitTime(now);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', phone: '', message: '' });
    setErrors({});
    setSubmitStatus(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl">
        <div className="px-6 py-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-user mr-2"></i>Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out`}
                  placeholder="John Doe"
                  aria-label="Name"
                  aria-describedby="name-error"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600" id="name-error">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-envelope mr-2"></i>Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out`}
                  placeholder="john@example.com"
                  aria-label="Email"
                  aria-describedby="email-error"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600" id="email-error">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-phone mr-2"></i>Phone (optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out`}
                  placeholder="+1 (555) 123-4567"
                  aria-label="Phone"
                  aria-describedby="phone-error"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600" id="phone-error">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-comment mr-2"></i>Message
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.message ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out`}
                  placeholder="Your message here..."
                  aria-label="Message"
                  aria-describedby="message-error"
                />
                <div className="mt-1 flex justify-between">
                  <span className={`text-sm ${
                    formData.message.length > MESSAGE_MAX_LENGTH ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {formData.message.length}/{MESSAGE_MAX_LENGTH} characters
                  </span>
                  {errors.message && (
                    <p className="text-sm text-red-600" id="message-error">{errors.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Message */}
            {submitStatus && (
              <div className={`rounded-md p-4 ${
                submitStatus.type === 'success' ? 'bg-green-50' : 'bg-red-50'
              } transition-all duration-300 ease-in-out`}>
                <p className={`text-sm ${
                  submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  <i className={`mr-2 fas ${
                    submitStatus.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'
                  }`}></i>
                  {submitStatus.message}
                </p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-150 ease-in-out ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Send Message
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 ease-in-out"
              >
                <i className="fas fa-redo mr-2"></i>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;

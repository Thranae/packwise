import React, { useState, useRef, useEffect } from 'react';

const OtpInput = ({ length = 6, value = '', onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    // Sync external value with local state if it's cleared
    if (value === '') {
      setOtp(new Array(length).fill(''));
    }
  }, [value, length]);

  const handleChange = (index, e) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newOtp = [...otp];
    // Allow only the last entered character if multiple are pasted
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Notify parent
    const combinedOtp = newOtp.join('');
    onChange(combinedOtp);

    // Focus next input if a value was entered
    if (val && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        // Focus previous input if current is empty and backspace is pressed
        inputRefs.current[index - 1].focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        onChange(newOtp.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    if (!pasteData) return;

    const newOtp = [...otp];
    pasteData.split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Focus the next empty input or the last one
    const nextIndex = Math.min(pasteData.length, length - 1);
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
  };

  return (
    <div className="flex justify-between items-center gap-1 sm:gap-2 my-6 w-full">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          ref={(ref) => (inputRefs.current[index] = ref)}
          value={data}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="flex-1 max-w-[52px] min-w-[36px] aspect-[4/5] sm:aspect-square text-center text-[22px] sm:text-[26px] font-bold text-white 
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-[14px] 
          shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_2px_6px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.2)] 
          focus:outline-none focus:bg-white/20 focus:border-[var(--color-accent)] 
          focus:shadow-[0_0_20px_rgba(79,124,255,0.4),inset_0_2px_6px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.2)] 
          transition-all duration-300 placeholder-white/20"
        />
      ))}
    </div>
  );
};

export default OtpInput;

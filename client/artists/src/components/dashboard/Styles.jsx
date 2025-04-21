import React from "react";

const Styles = () => {
  return (
    <style>{`
      .animate-in {
        animation: fadeIn 0.8s ease-out forwards;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }

      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .animate-fade-in-up {
        animation: fade-in-up 0.3s ease-out forwards;
      }

      .animate-fade-in {
        animation: fade-in 0.25s ease-out forwards;
      }

      .animate-scale-in {
        animation: scale-in 0.3s ease-out forwards;
      }

      .animate-fade-in-slow {
        animation: fade-in 0.8s ease-out forwards;
      }

      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes scale-in {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }

      .animate-slide-up {
        animation: slide-up 0.3s ease forwards;
      }

      @keyframes slide-up {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      /* Responsive adjustments for modal */
      @media (max-width: 768px) {
        .modal-content {
          flex-direction: column;
          max-height: 85vh;
        }
        .modal-image {
          max-height: 50vh;
        }
        .modal-details {
          max-height: 35vh;
          overflow-y: auto;
        }
      }
    `}</style>
  );
};

export default Styles;

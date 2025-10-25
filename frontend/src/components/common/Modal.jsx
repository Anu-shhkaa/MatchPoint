import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react'; // You'll need to install: npm install @headlessui/react
import { XMarkIcon } from '@heroicons/react/24/solid';

/**
 * A reusable Modal component.
 *
 * @param {boolean} isOpen - Whether the modal is open or not
 * @param {function} onClose - Function to call when the modal should close
 * @param {string} title - The title of the modal
 * @param {React.ReactNode} children - The content of the modal
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    // 'Transition' handles the fade in/out animations
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* The backdrop overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        {/* The modal panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark p-6 text-left align-middle shadow-xl transition-all">
                {/* Modal Header */}
                <div className="flex justify-between items-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-text-light-primary dark:text-text-dark-primary"
                  >
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="mt-4">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;

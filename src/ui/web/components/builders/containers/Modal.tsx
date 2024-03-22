import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface IProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<IProps> = ({ isOpen, onClose, children, title }) => {
  return (
    <>
      {createPortal(
        <>
          {isOpen && (
            <>
              <div
                className="fixed top-0 left-0 w-full h-full bg-black opacity-80 z-40"
                onClick={onClose}
              ></div>
              <div className="fixed top-[4] left-[5%] right-[5%] bottom-1/4 rounded-md flex flex-col bg-white border-4 border-gray border-solid mx-auto opacity-100 z-50">
                <div className="bg-blue-500 text-white flex items-center justify-between px-4 py-2 border-b-2 border-gray-400">
                  <span className="text-lg font-bold">{title.toUpperCase()}</span>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={onClose}
                  >
                    X
                  </button>
                </div>
                <div className='px-10 py-5 flex-grow overflow-y-auto'>
                  {children}
                </div>
              </div>
            </>
          )}
        </>,
        document.getElementById("portal-root") as HTMLElement
      )}
    </>
  );
};



export default Modal;

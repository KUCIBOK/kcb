import { useState } from 'react'

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/[0.06] pb-4">
      <button className="flex justify-between items-center w-full text-left" onClick={onClick}>
        <h3 className="text-lg font-medium text-white">{question}</h3>
        <svg
          className={`fill-kcb-or shrink-0 ml-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <rect y="7" width="16" height="2" rx="1" />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ${
              isOpen ? 'rotate-90 opacity-0' : 'rotate-0'
            }`}
          />
        </svg>
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pt-2 text-kcb-sable">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function Accordions({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null)

  const handleItemClick = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4 w-full">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openIndex === index}
          onClick={() => handleItemClick(index)}
        />
      ))}
    </div>
  )
}

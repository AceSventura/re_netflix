//HOOKS REACT: Importazione degli strumenti base per la gestione dello stato e del DOM.
import React, { useState } from 'react';
// LIBRERIE ESTERNE
import { Plus, X } from 'lucide-react';

// array con domande/risposte per faq
const faqData = [
  {
    id: 1,
    question: "Cos'è Netflix?",
    answer: "Netflix è un servizio di streaming che offre una varietà di serie TV, film, documentari pluripremiati e tanto altro su una vasta gamma di dispositivi connessi a Internet.\n\nGuarda quello che vuoi, quando vuoi. Il tutto a una quota mensile ridotta. C'è sempre qualcosa di nuovo da scoprire: aggiungiamo nuovi film e serie TV ogni settimana!"
  },
  {
    id: 2,
    question: "Quanto costa Netflix?",
    answer: "Guarda Netflix su smartphone, tablet, Smart TV, laptop o dispositivi per lo streaming, il tutto per un importo mensile fisso. Piani da 6,99 € a 19,99 €/mese."
  },
  {
    id: 3,
    question: "Dove posso guardare Netflix?",
    answer: "Guarda Netflix dove vuoi, quando vuoi. Accedi al tuo account per guardare subito Netflix dal tuo computer su netflix.com oppure da qualsiasi dispositivo connesso a Internet che supporta l'app Netflix, come smart TV, smartphone, tablet, lettori multimediali per streaming e console per videogiochi.\n\nCon l'app per iOS o Android puoi anche scaricare i tuoi programmi preferiti. Usa la funzionalità di download per guardare i contenuti mentre sei in viaggio e senza connessione a Internet. Porta Netflix sempre con te."
  },
  {
    id: 4,
    question: "Come posso disdire?",
    answer: "Netflix è flessibile. Puoi facilmente disdire il tuo contratto online con due clic. Nessuna penale: attiva o disdici il tuo account in qualsiasi momento."
  },
  {
    id: 5,
    question: "Cosa posso guardare su Netflix?",
    answer: "Netflix ha un nutrito catalogo di lungometraggi, documentari, serie TV, anime, originali Netflix pluripremiati e tanto altro. Guarda tutto quello che vuoi, in qualsiasi momento."
  },
  {
    id: 6,
    question: "Netflix è adatto ai bambini?",
    answer: "L'area Netflix Bambini, già inclusa nell'abbonamento, offre ai genitori un maggiore controllo sui contenuti e ai più piccoli uno spazio dedicato dove guardare serie TV e film per tutta la famiglia.\n\nI profili Bambini hanno un filtro famiglia con PIN che ti permette di limitare l'accesso ai contenuti in base alla fascia d'età e bloccare la visione di titoli specifici."
  }
];

// Dichiarazione del Function Component principale
const FaqSection = () => {

  // Conserviamo l'INDICE (un numero) della FAQ attualmente aperta.
  // Stato per gestire quale FAQ è aperta (-1 significa nessuna)
  const [activeIndex, setActiveIndex] = useState(-1);

  const toggleFaq = (index: number) => {
    // Se clicco sulla FAQ che è GIA' aperta (activeIndex === index), la chiudo impostando -1.
    // Altrimenti, imposto il nuovo indice, che chiuderà automaticamente quella precedente
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <div className="bg-black">
      <h2 className="text-2xl lg:text-3xl font-black mb-10">
        Domande frequenti
      </h2>

      <div className="flex flex-col gap-2">

        {/* ITERAZIONE (map) E KEY PROP: mappiamo i dati statici.
            Usiamo `faq.id` come chiave univoca per il Virtual DOM. */}
        {faqData.map((faq, index) => (
          <div key={faq.id} className="w-full">

            {/* Bottone Trigger */}
            <button
              onClick={() => toggleFaq(index)}
              className="flex justify-between items-center w-full p-6 bg-[#2d2d2d] hover:bg-[#414141] transition-colors duration-200 text-left"
            >
              <span className="text-xl lg:text-2xl font-medium select-none">
                {faq.question} {/*React legge l'oggetto, estrae il valore associato alla chiave question
                                 e lo stampa a schermo come testo all'interno dello <span>.*/}
              </span>

              {/* RENDERING CONDIZIONALE DELL'ICONA:
                  Se questa specifica riga è quella attiva, mostra la X (chiudi).
                  Altrimenti mostra il Plus (apri). */}
              <div className="transition-transform duration-300">
                {activeIndex === index ? (
                  <X size={36} strokeWidth={1.5} />
                ) : (
                  <Plus size={36} strokeWidth={1.5} />
                )}
              </div>
            </button>

            {/* Contenuto con animazione CSS pura per l'altezza
             Qui si usa un hack moderno con CSS Grid:
                - grid-rows-[0fr]: Nasconde il contenuto "schiacciando" la griglia a zero.
                - grid-rows-[1fr]: Espande la griglia per accomodare l'altezza naturale del contenuto.
                Questo permette a 'transition-all' di calcolare l'animazione in modo fluido. */}
            <div
              className={`grid transition-all duration-300 ease-in-out bg-[#2d2d2d] mt-[1px] ${
                activeIndex === index 
                  ? 'grid-rows-[1fr] opacity-100 p-6' 
                  : 'grid-rows-[0fr] opacity-0 p-0 overflow-hidden'
              }`}
            >

              {/* FORMATTAZIONE TESTO MULTILINEA:
                  'whitespace-pre-line' è una classe Tailwind fondamentale qui.
                  Ordina al browser di rispettare i caratteri di a capo (\n\n) presenti
                  nelle stringhe di testo grezzo dell'array faqData, trasformandoli in
                  effettivi ritorni a capo visivi nell'HTML. Senza di questa, il testo 
                  sarebbe un unico blocco ininterrotto. */}
              <p className="text-xl lg:text-2xl overflow-hidden leading-relaxed whitespace-pre-line text-[#efefef]">
                {faq.answer} {/*React legge l'oggetto, estrae il valore associato alla chiave answer
                                e lo stampa a schermo come testo all'interno dello <span>.*/}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
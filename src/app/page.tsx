'use client';

import { motion } from 'framer-motion';
import { DM_Sans, Monsieur_La_Doulaise } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin']
});

const monsieur = Monsieur_La_Doulaise({
  weight: '400',
  subsets: ['latin'],
});

const serviceCards = [
  {
    id: 1,
    title: "CREATIVE DIRECTION",
    description: "Get recognized with a unique brand identity",
    icon: "/images/creative_direction.png",
    color: "from-pink-500 to-purple-500"
  },
  {
    id: 2,
    title: "EVENT DESIGN",
    description: "Create marketing materials for your events that make people stop and take notice.",
    icon: "/images/event_design.png",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "ALBUM ART",
    description: "Create visuals as powerful as your music.",
    icon: "/images/album_art.jpg",
    color: "from-orange-500 to-red-500"
  }
];

export default function Home() {
  return (
    <div
      className="min-h-screen text-white overflow-hidden"
    >
      {/* Navbar Section */}
      {/* Hero Section */}
      <section
        className="relative h-screen flex flex-col items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div>
            <div
              className="flex flex-row items-center"
            >
              <h1 className=
                  {`${dmSans.className}
                  text-6xl
                  mb-0
                  font-normal
                  tracking-tighter
                  bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent`
                  }
                >
                  TURNING ARTISTS INTO
              </h1>
              <h1 className=
                  {`${monsieur.className}
                  relative
                  text-8xl
                  mb-3
                  -ml-10
                  bg-gradient-to-r from-indigo-200 to-indigo-400 bg-clip-text text-transparent`
                  }
              >
                  Icons
              </h1>
            </div>
            
            <motion.img
              src="/images/butterfly.png"
              alt="Butterfly"
              className='w-60 h-auto mx-auto mb-8'
              animate={{ y: [0,-5,0] }}
              transition={{duration: 2, repeat: Infinity}}
            />
            <h4 className=
              {`${dmSans.className}
              text-md
              font-medium
              tracking-widest
              mt-10`}
            >
              TAP INTO THE PULSE OF YOUR AUDIENCE <br></br>
              TELL YOUR STORY
            </h4>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section
        className="relative h-screen px-50 flex flex-col items-center justify-center"
      >
        <h4 className=
              {`${dmSans.className}
              text-1xl
              mb-0`}
        >
          EXPLORE THE POSSIBILITIES
        </h4>
        <h2 className=
                {`${dmSans.className}
                text-6xl
                mb-0`}
        >
          DESIGN THE SOLUTION
        </h2>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div
            className="grid md:grid-cols-2 gap-14"
          >
            <p
              className=" text-left"
            >
              Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout. Lorem ipsum is mostly a part of a Latin text by the classical author and philosopher Cicero.
            </p>
            <p
              className=" text-left"
            >
              Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout. Lorem ipsum is mostly a part of a Latin text by the classical author and philosopher Cicero.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Service Cards */}
            {serviceCards.map((service) => (
              <motion.div
                key={`service-${service.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: service.id * 0.2 }}
                className="relative rounded-4xl p-6 aspect-square overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-10`}/>
                <div className="relative z-10">
                  <img src="{service.icon}" alt="{service.title}" />
                  <h3
                    className={`${dmSans.className} text-2xl font-medium mb-2`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-gray-300"
                  >
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div>
            {/* Insert CTA tagline here */}
          </div>
          <div>
            {/* Insert CTA text here */}
          </div>
        </motion.div>
      </section>

      {/* Gallery Grid */}
      <section>
        <div>
          <div>
            {/* Photo Cards */}
            {[1,2,3].map((item) => (
              <motion.div
                key={`gallery-${item}`}
                className="relative rounded-full aspect-square"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20  }}
                animate={{ opacity: 1, y: 0 }}
                transition={{duration: 0.5, delay: item * 0.2}}
              >
                <div/>
                <div>
                  {/* Add images here */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Nicole Section */}
      <section
        className="relative h-screen flex flex-row items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div>
            <motion.img
              src="/images/nicole.jpeg"
              alt="Photo of Nicole"
              className="w-24 h-auto mx-auto mb-8"
              animate={{ y: [0,-10,0] }}
              transition={{duration: 2, repeat: Infinity}}
            />
          </div>
        </motion.div>
      </section>

      {/* Footer Section */}
    </div>
  );
}

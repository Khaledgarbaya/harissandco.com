import { FC, ElementType } from "react"
import type { RootComponentInstance } from "@uniformdev/canvas"
import Image from "next/image"

export type HomePageProps = {
  preview: boolean
  useUniformComposition?: boolean
  data: RootComponentInstance
  providers: ElementType
  skipContainerWrappersList?: string[]
}

const HomePage: FC<HomePageProps> = ({}) => (
  <div className="bg-spring-wood rounded-bottom pt-8">
    <header className="flex text-outer-space p-4 justify-between items-center bg-white rounded-xl shadow-md container max-w-7xl mx-auto">
      <h1>
        <Image src="/logo.png" alt="logo" width={100} height={100} />
      </h1>
      <nav>
        <a href="#" className="mx-2">
          About the Series
        </a>
        <a href="#" className="mx-2">
          Menu & Pricing
        </a>
        <a href="#" className="mx-2">
          Schedule & Locations
        </a>
        <a href="#" className="mx-2">
          Gallery
        </a>
        <a href="#" className="mx-2">
          FAQ
        </a>
        <button className="ml-4 py-2 border border-cinna-bar text-cinna-bar rounded px-8">
          Reserve a Seat
        </button>
      </nav>
    </header>
    <section className="p-8 mt-10 container mx-auto">
      <h2 className="text-7xl font-bold text-outer-space text-center max-w-4xl w-full mx-auto">
        Popup Brunch Series in <span className="text-cinna-bar">Berlin</span>{" "}
        introducing <span className="text-cinna-bar">Tunisian cuisine</span>
      </h2>
      <div className="mt-6 text-center max-w-4xl w-full mx-auto">
        <button className="mt-4 px-6 py-3 bg-cinna-bar text-white rounded-lg">
          Get your Ticket
        </button>
      </div>
      <div className="mt-6 mx-auto">
        <Image
          className="mx-auto"
          src="/undraw_Street_food_re_uwex.png"
          alt="Illustration"
          width={1280}
          height={700}
        />
      </div>
    </section>
    <section className="bg-white">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#f5f3ed"
          fillOpacity="1"
          d="M0,128L1440,32L1440,0L0,0Z"
        ></path>
      </svg>
    </section>
    <section className="bg-white">
      <div className="container max-w-7xl mx-auto text-center">
        <h3 className="text-7xl font-bold text-outer-space text-center max-w-4xl w-full mx-auto">
          Tunisian cuisine, a <span className="text-cinna-bar">delightful</span>{" "}
          blend of various influences.
        </h3>
        <p className="mt-4 text-lg text-outer-space">
          Join us in Berlin for a memorable brunch experience.
        </p>
      </div>
    </section>
    <section className="bg-spring-wood">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#fff" fillOpacity="1" d="M0,128L1440,32L1440,0L0,0Z"></path>
      </svg>
    </section>
    <section className="bg-spring-wood">
      <h2 className="text-7xl font-bold text-cinna-bar text-center max-w-4xl w-full mx-auto">
        Menu & Pricing
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
        <div className="mx-auto">
          <Image
            src="/undraw_breakfast.png"
            width={300}
            height={300}
            alt="Dish name"
            className="aspect-square object-cover mb-4"
          />
          <h3 className="text-outer-space text-xl font-semibold mb-2">
            Dish Name
          </h3>
          <p className="text-outer-space text-gray-600 mb-4">
            Short description of the dish.
          </p>
          <span className="text-outer-space text-gray-800 font-semibold">
            EUR 25
          </span>
        </div>
        <div className="mx-auto">
          <Image
            src="/undraw_barbecue.png"
            width={300}
            height={300}
            alt="Dish name"
            className="aspect-square object-cover mb-4"
          />
          <h3 className="text-outer-space text-xl font-semibold mb-2">
            Dish Name
          </h3>
          <p className="text-outer-space text-gray-600 mb-4">
            Short description of the dish.
          </p>
          <span className="text-outer-space text-gray-800 font-semibold">
            EUR 25
          </span>
        </div>
        <div className="mx-auto">
          <Image
            src="/undraw_pancakes.png"
            width={300}
            height={300}
            alt="Dish name"
            className="aspect-square object-cover mb-4"
          />
          <h3 className="text-outer-space text-xl font-semibold mb-2">
            Dish Name
          </h3>
          <p className="text-outer-space text-gray-600 mb-4">
            Short description of the dish.
          </p>
          <span className="text-outer-space text-gray-800 font-semibold">
            EUR 25
          </span>
        </div>
      </div>
    </section>

    <footer className="bg-white py-6 shadow-md ">
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <a href="#" className="text-2xl font-bold text-gray-800">
            <Image src="/logo.png" alt="logo" width={100} height={100} />
          </a>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="mx-2">
                About the Series
              </a>
            </li>
            <li>
              <a href="#" className="mx-2">
                Menu & Pricing
              </a>
            </li>
            <li>
              <a href="#" className="mx-2">
                Schedule & Locations
              </a>
            </li>
            <li>
              <a href="#" className="mx-2">
                Gallery
              </a>
            </li>
            <li>
              <a href="#" className="mx-2">
                FAQ
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  </div>
)
export default HomePage

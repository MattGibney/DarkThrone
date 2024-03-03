import PageHeader from '../../../components/layout/pageHeader';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Badge, BadgeProps } from '@darkthrone/react-components';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';

export default function RoadmapPage() {
  const phases = [
    {
      title: 'Alpha Gameplay',
      status: {
        text: 'In Progress',
        variant: 'yellow' as BadgeProps['variant'],
      },
      image: '/alpha.jpg',
      github:
        'https://github.com/users/MattGibney/projects/5/views/1?pane=info',
      description: `
The Alpha focuses on the early game. The vast majority of development will be surface level. While many players enjoyed the depth that came with the original game. We are first prioritising solid fundamentals and a well built early game.

In addition to gameplay, we will also be working on the game's infrastructure. This includes the game's servers, databases, and other backend systems. We will also be working on the game's frontend, including the game's UI and UX.
`,
    },
    {
      title: 'Social Features',
      status: {
        text: 'Planned',
        variant: 'gray' as BadgeProps['variant'],
      },
      image: '/social.jpg',
      github: '',
      description: `
In this pahse, we'll be focusing more on the social aspects of the game. This includes a messaging system between players, a friends list, and an alliance system. We will also spend time putting some proper stucture into the Discord server. Perhaps with some custom integrations.

The original DarkThrone had a very active community, especially in the forums. We're hoping to bring that back however forums may not be the best option in 2024. We'll be exploring different options and seeking guidance from the community.
`,
    },
  ];

  return (
    <div>
      <PageHeader text="Roadmap" />

      <div className="bg-zinc-800 text-zinc-200">
        <div className="max-w-screen-lg mx-auto py-10 px-4">
          <p className="text-xl leading-7">
            The project is split up into phases, each centred around a key
            theme. There are strictly no time scales on these phases, as this is
            a community project and we are all volunteers. We will work on this
            project as and when we can. We are also open to new ideas and
            suggestions, so if you have any, please let us know!
          </p>

          {phases.map((phase) => (
            <section className="grid md:grid-cols-3 gap-6 my-20">
              <div>
                <div className="rounded-lg h-64 sm:h-48 overflow-hidden">
                  <img
                    src={phase.image}
                    className="object-cover object-center w-full h-full"
                    alt=""
                  />
                </div>
                <Link
                  to={phase.github}
                  target="_blank"
                  className="flex w-full justify-center rounded-md px-8 py-3 mt-4 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-yellow-600 hover:bg-yellow-500 focus-visible:outline-yellow-600 text-white"
                >
                  View on GitHub
                  <ArrowTopRightOnSquareIcon className="w-6 h-6 ml-2" />
                </Link>
              </div>
              <div className="md:col-span-2">
                <div className="border-b border-yellow-600 pb-1 mt-1 mb-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{phase.title}</h2>
                  <div>
                    <Badge
                      text={phase.status.text}
                      variant={phase.status.variant}
                    />
                  </div>
                </div>

                <Markdown className="max-w-none prose prose-p:leading-6 prose-p:mb-2 prose-zinc prose-invert">
                  {phase.description}
                </Markdown>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

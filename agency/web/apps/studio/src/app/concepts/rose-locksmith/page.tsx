import { Hero } from './_components/hero';
import { Lock } from './_components/lock';
import { Paint } from './_components/paint';
import { Reviews, Story, Visit } from './_components/rest';
import { Services } from './_components/services';

export default function RoseLocksmith() {
  return (
    <main>
      <Hero />
      <Services />
      <Lock />
      <Story />
      <Paint />
      <div className="pt-32">
        <Reviews />
      </div>
      <Visit />
    </main>
  );
}

import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { PenTool, Lock, Zap, FileCode2, Users, Archive, Hammer } from 'lucide-react';

type FeatureItem = {
  title: string;
  description: ReactNode;
  icon: ReactNode;
};

const features: FeatureItem[] = [
    {
    title: 'Community‑first',
    icon: <Users className={styles.icon} />,
    description: (
      <>Built by and for Panic Nation members to preserve our history, celebrate creativity, and keep our little slice of the internet ours.</>
    ),
  },
  {
    title: 'Member‑written Articles',
    icon: <PenTool className={styles.icon} />,
    description: (
      <>Members can draft, review, and publish Panic Nation news, reviews, opinions, and highlights—free from outside noise.</>
    ),
  },
    {
    title: 'Built by Members',
    icon: <Hammer className={styles.icon} />,
    description: (
      <>Crafted by <strong>Bubbafett5611</strong> (developer) and <strong>CaptainSlayer</strong> (lead writer), with contributions from the whole crew.</>
    ),
  },
];

function FeatureCard({title, description, icon}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.col)}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>{icon}</div>
        <Heading as="h3" className={styles.cardTitle}>{title}</Heading>
        <p className={styles.cardBody}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.heroBanner}>
        <img src={require('@site/static/img/pn-10years-1.png').default} alt="Panic Nation 10 Year Anniversary" />
      </div>
      <div className={styles.sectionBg} aria-hidden="true" />
      <div className="container">
        <div className={styles.headerRow}>
          <Heading as="h2" className={styles.title}>Welcome to Panic Nation</Heading>
          <p className={styles.subtitle}>
            A passion project by <strong>Bubbafett5611</strong> (developer) and <strong>CaptainSlayer</strong> (lead writer), a home for our community to write, share, and archive what matters.
          </p>
          <div className={styles.ctaRow}>
            <a className={styles.cta} href="/blog">Read the Latest Post!</a>
          </div>
        </div>
        <div className="row">
          {features.map((item, i) => (
            <FeatureCard key={i} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
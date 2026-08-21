"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
} from "react";
import { SocialIcon } from "@/components/ui/social-icon";
import type { TeamMember } from "@/data/team";

const RING_RADIUS_PX = 520;
const RING_DURATION_SECONDS = 28;
const CARD_WIDTH_PX = 248;
const CARD_HEIGHT_PX = 390;

type TeamShowcaseProps = {
  members: TeamMember[];
};

type TeamMemberCardProps = {
  member: TeamMember;
  active?: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
};

function TeamMemberCard({
  member,
  active = false,
  onActivate,
  onDeactivate,
}: TeamMemberCardProps) {
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }

    onDeactivate?.();
  };

  return (
    <article
      tabIndex={0}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={handleBlur}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-zinc-100 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand ${
        active ? "scale-[1.04] shadow-2xl ring-brand/60" : "hover:-translate-y-1 hover:shadow-xl"
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={member.photo}
          alt={`${member.name}, ${member.role}`}
          fill
          sizes="(max-width: 1024px) 80vw, 248px"
          className="object-cover transition-transform duration-700 group-hover:scale-105 group-focus:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-black text-ink">{member.name}</h3>
        <p className="mt-1 text-sm font-bold text-brand">{member.role}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-6  ">
          {member.headline}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex gap-2 text-brand">
            {member.socials.slice(0, 3).map((social) => (
              <Link
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.name} de ${member.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 transition-colors hover:bg-brand hover:text-white focus-visible:bg-brand focus-visible:text-white focus-visible:outline-none"
              >
                <SocialIcon id={social.id} size={14} />
              </Link>
            ))}
          </div>

          <Link
            href={`/membres/${member.slug}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-brand transition-colors hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Profil
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function TeamFallbackGrid({ members }: TeamShowcaseProps) {
  return (
    <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((member) => (
        <li key={member.slug}>
          <TeamMemberCard member={member} />
        </li>
      ))}
    </ul>
  );
}

function TeamMobileSnap({ members }: TeamShowcaseProps) {
  return (
    <div className="mt-12 lg:hidden">
      <ul className="team-mobile-snap-mask flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {members.map((member) => (
          <li
            key={member.slug}
            className="w-[78vw] max-w-[21rem] shrink-0 snap-center"
          >
            <TeamMemberCard member={member} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function subscribeToHydration() {
  return () => {};
}

function getHydratedSnapshot() {
  return true;
}

function getServerHydratedSnapshot() {
  return false;
}

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onChange);

  return () => {
    mediaQuery.removeEventListener("change", onChange);
  };
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

export default function TeamShowcase({ members }: TeamShowcaseProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!hydrated || reducedMotion) return;

    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);

        if (visible) {
          setHasBeenVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: "120px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hydrated, reducedMotion]);

  if (!hydrated || reducedMotion) {
    return (
      <div ref={sectionRef}>
        <TeamFallbackGrid members={members} />
      </div>
    );
  }

  const angleStep = 360 / members.length;
  const paused = !isVisible || activeIndex !== null;

  return (
    <div ref={sectionRef}>
      <TeamMobileSnap members={members} />

      <div className="mt-12 hidden lg:block">
        {hasBeenVisible ? (
          <div
            className="relative mx-auto h-[42rem] max-w-7xl overflow-hidden"
            style={{ perspective: "1700px" }}
          >
            <ul
              aria-label="Membres de l'equipe Afroza Editor"
              className="team-ring-spin absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
              style={{
                animationDuration: `${RING_DURATION_SECONDS}s`,
                animationPlayState: paused ? "paused" : "running",
              }}
            >
              {members.map((member, index) => {
                const angle = angleStep * index;
                const active = activeIndex === index;

                return (
                  <li
                    key={member.slug}
                    className="absolute left-1/2 top-1/2 "
                    style={{
                      width: `${CARD_WIDTH_PX}px`,
                      height: `${CARD_HEIGHT_PX}px`,
                      zIndex: active ? 50 : members.length - Math.abs(index - (activeIndex ?? index)),
                      transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${RING_RADIUS_PX}px)`,
                    }}
                  >
                    <TeamMemberCard
                      member={member}
                      active={active}
                      onActivate={() => setActiveIndex(index)}
                      onDeactivate={() => setActiveIndex(null)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <TeamFallbackGrid members={members} />
        )}
      </div>

      <style>{`
        @keyframes team-ring-spin {
          from {
            transform: translate(-50%, -50%) rotateY(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotateY(-360deg);
          }
        }

        .team-ring-spin {
          animation-name: team-ring-spin;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .team-mobile-snap-mask {
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }

        @media (prefers-reduced-motion: reduce) {
          .team-ring-spin {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

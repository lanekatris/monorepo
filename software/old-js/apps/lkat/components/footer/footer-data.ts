export type SocialIconType =
  | 'email'
  | 'linkedin'
  | 'youtube'
  | 'reddit'
  | 'facebook'
  | 'github';

export interface SocialIcon {
  href: string;
  label: string;
  type: SocialIconType;
}

export const footerData: SocialIcon[] = [
  {
    href: 'mailto:lanekatris@gmail.com',
    label: 'Email',
    type: 'email',
  },
  {
    href: 'https://www.linkedin.com/in/lane-katris-80610a44/',
    label: 'LinkedIn',
    type: 'linkedin',
  },
  {
    href: 'https://www.youtube.com/channel/UC6APCLAuq3Egox7Z5kaWgEQ',
    label: 'YouTube',
    type: 'youtube',
  },
  {
    href: 'https://www.reddit.com/user/loonison101',
    label: 'Reddit',
    type: 'reddit',
  },
  {
    href: 'https://www.facebook.com/lane.katris',
    label: 'Facebook',
    type: 'facebook',
  },
  {
    href: 'https://github.com/lanekatris',
    label: 'GitHub',
    type: 'github',
  },
];

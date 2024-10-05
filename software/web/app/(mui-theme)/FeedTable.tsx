import { CgDisc } from 'react-icons/cg';
import {
  GiDiscGolfBasket,
  GiMountainClimbing,
  GiMountains,
  GiBookmark,
  GiNotebook,
  GiWrench,
  GiMoneyStack
} from 'react-icons/gi';
import { MdOutlineAttachMoney } from 'react-icons/md';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Markdown from 'react-markdown';
import {
  Box,
  Chip,
  Divider,
  Link,
  List,
  ListDivider,
  ListItem,
  Stack,
  Table,
  Typography
} from '@mui/joy';
import React from 'react';
import { FeedItem, FeedItemType } from '../../feed/feed-types';
// import SimpleCalendar from './SimpleCalendar';

interface FeedTableProps {
  rows: FeedItem[];
}

export const feedIcon: { [k in FeedItemType]: React.ReactElement } = {
  'obsidian-adventure': <GiMountains size={20} />,
  'disc-golf-disc': <CgDisc size={20} />,
  'disc-golf-scorecard': <GiDiscGolfBasket size={20} />,
  climb: <GiMountainClimbing size={20} />,
  raindrop: <GiBookmark size={20} />,
  memo: <GiNotebook size={20} />,
  maintenance: <GiWrench size={20} />,
  purchase: <MdOutlineAttachMoney size={20} />
};

export const feedTitle: { [k in FeedItemType]: string } = {
  climb: 'Climbed Route',
  'disc-golf-disc': 'New Disc',
  'disc-golf-scorecard': 'DG Round',
  'obsidian-adventure': 'Adventure',

  raindrop: 'Bookmark',
  memo: 'Memo',
  maintenance: 'Maintenance',
  purchase: 'Purchase'
};

export interface FeedLineItemProps {
  type: FeedItemType;
  date: Date;

  children: React.ReactNode;
  link?: string;
}

export const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

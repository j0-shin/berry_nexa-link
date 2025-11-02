// assets
import { IconMessageChatbot } from '@tabler/icons-react';

// constant
const icons = { IconMessageChatbot };

// ==============================|| CHATBOT MENU ITEMS ||============================== //

const chatbot = {
  id: 'chatbot',
  title: 'AI Chatbot',
  type: 'group',
  children: [
    {
      id: 'chatbot-main',
      title: 'Chatbot',
      type: 'item',
      url: '/chatbot',
      icon: icons.IconMessageChatbot,
      breadcrumbs: false
    },
    {
      id: 'agent-main',
      title: 'Agent',
      type: 'item',
      url: '/agent',
      icon: icons.IconMessageChatbot,
      breadcrumbs: false
    }
  ]
};

export default chatbot;

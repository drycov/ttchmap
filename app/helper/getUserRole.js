// Mock user data
const users = [
  {
    username: 'admin',
    role: 'admin',
    fname: 'Денис',
    lname: 'Рыков (ТТК)',
    post: 'Инженер сети ст. Кумыстау',
    positionid: '5',
    position: 'Оскементранстелеком',
    sysrole: 'Администратор'
  },
  {
    username: 'user',
    role: 'user',
    fname: 'Денис',
    lname: 'Рыков (ТТК)',
    post: 'Инженер сети ст. Кумыстау',
    positionid: '5',
    position: 'Оскементранстелеком',
    sysrole: 'Пользователь'
  },
  // Add more user objects as needed
];

// Function to get the user role
const getUserRole = (username) => {
  const user = users.find((user) => user.username === username);
  return user ? user.role : null;
};

export default getUserRole;

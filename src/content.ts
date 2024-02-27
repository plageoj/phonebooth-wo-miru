const headingSelector = 'h2.card-title';

type Room = HTMLLIElement;

const getBookings = () => {
  const bookings = document.querySelector('wework-booking-room-memberweb');
  if (!bookings) throw new Error('Could not find the bookings element');

  return bookings;
};

/**
 * Map over all the rooms and apply the given function.
 * @param fn The function to apply to each room.
 */
const mapRooms = (fn: (room: Room) => void) => {
  const rooms = document.evaluate(
    '//li[//h2[@class="card-title"]]',
    getBookings(),
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
  );

  for (let i = 0; i < rooms.snapshotLength; i++) {
    const room = rooms.snapshotItem(i) as Room;
    setTimeout(() => fn(room));
  }
};

const hideConferenceRooms = () => {
  mapRooms((room: Room) => {
    const heading = room.querySelector(headingSelector) as HTMLHeadingElement;

    if (heading && !heading.textContent?.includes('電話')) {
      room.style.display = 'none';
    }
  });
};

const initialize = () => {
  const resetButton = document.evaluate(
    '//button[text()="絞り込み検索を解除"]',
    document.body,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
  ).singleNodeValue;

  const showAllRooms = () => {
    mapRooms((room) => {
      room.style.display = '';
    });

    document.querySelector('#pdm-filter-rooms')?.classList.remove('active');
  };

  resetButton?.addEventListener('click', showAllRooms);

  // add button to filter out conference rooms
  const button = document.createElement('button');
  button.textContent = 'フォンブースだけ見る';
  button.id = 'pdm-filter-rooms';

  button.addEventListener('click', () => {
    if (button.classList.contains('active')) return showAllRooms();
    hideConferenceRooms();
    button.classList.add('active');
  });

  document.querySelector('.quick-filter-section')?.appendChild(button);
};

const waitForSelector = (selector: string, to: 'shown' | 'hidden') =>
  new Promise<void>((resolve) => {
    if (
      (document.querySelector(selector) && to === 'shown') ||
      (!document.querySelector(selector) && to === 'hidden')
    ) {
      return resolve();
    }

    const observer = new MutationObserver(() => {
      if (
        (document.querySelector(selector) && to === 'shown') ||
        (!document.querySelector(selector) && to === 'hidden')
      ) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });

/**
 * Simplify the heading title to only show the booth number.
 */
const changeHeadingTitle = () => {
  const headings = document.querySelectorAll(headingSelector);
  for (const heading of headings) {
    heading.textContent =
      heading.textContent?.replace(/.*(電話.*) ※.*/, '$1') ?? '';
  }
};

const alignToNow = () => {
  mapRooms((room) => {
    const indicator = room.querySelector<HTMLDivElement>(
      '.fc-timeline-now-indicator-arrow',
    );

    room
      .querySelector('.fc-scroller.fc-scroller-liquid-absoluteco')
      ?.scrollTo(parseInt(indicator?.style.left ?? '0', 10), 0);
  });
};

(async () => {
  const selector = '.fc-scroller';
  await waitForSelector('.quick-filter-section', 'shown');
  initialize();
  while (1) {
    await waitForSelector(selector, 'shown');
    if (document.querySelector('.day-status')) {
      for (let j = 0; j < 2; j++) {
        document.querySelectorAll(selector)?.forEach((i) => i.remove());
        await waitForSelector(selector, 'shown');
      }
    }
    if (
      document.querySelector('#pdm-filter-rooms')?.classList.contains('active')
    ) {
      hideConferenceRooms();
    }
    changeHeadingTitle();
    alignToNow();
    await waitForSelector(selector, 'hidden');
  }
})();

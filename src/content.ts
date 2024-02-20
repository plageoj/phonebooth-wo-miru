const headingSelector = 'h2.card-title';

type Room = HTMLLIElement;

const getBookings = () => {
  const bookings = document.querySelector('memberweb-booking-drilldown');
  if (!bookings) throw new Error('Could not find the bookings element');

  return bookings;
};

/**
 * Map over all the rooms and apply the given function.
 * @param fn The function to apply to each room.
 */
const mapRooms = (fn: (room: Room) => void) => {
  const rooms = document.evaluate(
    '//li[a//h2[@class="card-title"]]',
    getBookings(),
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
  );

  for (let i = 0; i < rooms.snapshotLength; i++) {
    const room = rooms.snapshotItem(i) as Room;
    setTimeout(() => {
      fn(room);
    });
  }
};

const initialize = () => {
  const resetButton = document.evaluate(
    '//button[text()="絞り込み検索を解除"]',
    getBookings(),
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

    button.classList.add('active');

    const hideConferenceRoom = (room: Room) => {
      const heading = room.querySelector(headingSelector) as HTMLHeadingElement;

      if (!heading.textContent?.includes('電話')) {
        room.style.display = 'none';
      }
    };

    mapRooms(hideConferenceRoom);
  });

  document.querySelector('.quick-filter-section')?.appendChild(button);
};

const waitForSelector = (selector: string) =>
  new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
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
      .querySelector('.fc-scroller')
      ?.scrollTo(parseInt(indicator?.style.left ?? '0', 10), 0);
  });
};

(async () => {
  await waitForSelector('.fc-scroller');
  initialize();
  changeHeadingTitle();
  alignToNow();
})();

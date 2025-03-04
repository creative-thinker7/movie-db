import { useTranslations } from "next-intl";
import Page from "./Page";

interface Props {
  currentPage: number;
  total: number;
  maxButtons?: number;
  onChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  total,
  maxButtons = 5,
  onChange,
}: Props) {
  const t = useTranslations("Shared");

  const handleChange = (page: number) => {
    if (page >= 1 && page <= total) {
      onChange(page);
    }
  };

  const renderPrev = () => {
    return (
      <Page
        currentPage={currentPage}
        page={currentPage - 1}
        disabled={currentPage === 1}
        onClick={handleChange}
      >
        {t("PREV")}
      </Page>
    );
  };

  const renderPageButtons = () => {
    const pageButtons: React.ReactElement[] = [];
    let startPage;
    let endPage;
    let hasHiddenPagesAfter;

    if (maxButtons) {
      const hiddenPagesBefore = currentPage - Math.floor(maxButtons / 2);
      startPage = hiddenPagesBefore > 1 ? hiddenPagesBefore : 1;
      hasHiddenPagesAfter = startPage + maxButtons <= total;

      if (!hasHiddenPagesAfter) {
        endPage = total;
        startPage = total - maxButtons + 1;
        if (startPage < 1) {
          startPage = 1;
        }
      } else {
        endPage = startPage + maxButtons - 1;
      }
    } else {
      startPage = 1;
      endPage = total;
    }

    for (let page = startPage; page <= endPage; page += 1) {
      pageButtons.push(
        <Page
          key={page}
          currentPage={currentPage}
          page={page}
          onClick={handleChange}
        />,
      );
    }

    if (startPage !== 1) {
      pageButtons.unshift(
        <Page key="ellipsisFirst" disabled>
          ...
        </Page>,
      );
    }

    if (maxButtons && hasHiddenPagesAfter) {
      pageButtons.push(
        <Page key="ellipsis" disabled>
          ...
        </Page>,
      );

      if (endPage !== total) {
        pageButtons.push(
          <Page
            key={total}
            currentPage={currentPage}
            page={total}
            onClick={handleChange}
          />,
        );
      }
    }
    return pageButtons;
  };

  const renderNext = () => {
    return (
      <Page
        currentPage={currentPage}
        page={currentPage + 1}
        disabled={currentPage >= total}
        onClick={handleChange}
      >
        {t("NEXT")}
      </Page>
    );
  };

  // When there is only one page, no need to show pagination buttons.
  if (total <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-x-2">
      {renderPrev()}
      {renderPageButtons()}
      {renderNext()}
    </div>
  );
}

function extractAllMovieRows() {
  const rows = [];

  document
    .querySelectorAll(".single-row-lomo.has-inline-left-gutter")
    .forEach((rowBlock) => {
      const rowTitle = rowBlock
        .querySelector(".lomo-name.row-name")
        .textContent()
        .trim();

      const movies = [];

      rowBlock.querySelectorAll(".lomo .watch-title").forEach((movie) => {
        const id = movie.getAttribute("href").split("/").pop();
        const style =
          movie.querySelector(".title-boxart").style.backgroundImage;

        const imageUrl = style.slice(5, -2);

        movies.push({ id, imageUrl });
      });

      rows.push({ rowTitle, movies });
    });

  return JSON.stringify(rows, null, 2);
}

console.log(extractAllMovieRows());

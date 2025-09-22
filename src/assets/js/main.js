window.addEventListener("load", function () {
    const observer = new MutationObserver(() => {
        const navbar = document.querySelector(".main-navbar");

        if (navbar) {
            observer.disconnect(); // Dừng theo dõi khi đã tìm thấy navbar
            // console.log("✅ Navbar đã render:", navbar);

            let lastScrollY = window.scrollY;
            let isScrollingDown = false;

            window.addEventListener("scroll", function () {
                const currentScrollY = window.scrollY;

                if (currentScrollY > lastScrollY) {
                    if (currentScrollY > 50 && !isScrollingDown) {
                        navbar.style.top = "-75px"; // Ẩn Navbar
                        isScrollingDown = true;
                    }
                } else {
                    navbar.style.top = "0"; // Hiện Navbar
                    isScrollingDown = false;
                }

                lastScrollY = currentScrollY;
            });
        }
    });

    // Quan sát toàn bộ DOM khi có thay đổi
    observer.observe(document.body, { childList: true, subtree: true });
});

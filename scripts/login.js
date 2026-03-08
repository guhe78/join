      function startSplash() {
            let splash = document.getElementById("splash");
            if (!splash) return;
            let splashDelay = 800, animationDuration = 900, logoCornerDelay = 150;
            setTimeout(function () {
                splash.classList.add("animate");
                setTimeout(function () {
                    document.body.classList.add("logo-early");
                }, logoCornerDelay);
                setTimeout(function () {
                    splash.style.display = "none";
                }, animationDuration);
            }, splashDelay);
        }

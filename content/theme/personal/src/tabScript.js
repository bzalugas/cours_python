/*
When the content is loaded, initialize all classes & highlight code
 */
document.addEventListener("DOMContentLoaded", (event) => {
    init();
    const hash = document.location.hash;
    if (hash !== '')
    {
        setVisible(hash);
        setActive(hash);
    }
    document.querySelectorAll(".src").forEach(el => {
        // if (el.classList.contains("src-python"))
        //     el.classList.add("language-python");
        // else if (el.classList.contains("src-bash"))
        //     el.classList.add("language-bash");
        hljs.highlightElement(el);
    })
    document.querySelectorAll("code").forEach(el => {
        hljs.highlightElement(el);
    })
})
/*
When the hash changes, set the correct element visible on screen & set correct nav element active
 */
window.onhashchange = function(){
    const hash = document.location.hash;
    if (hash !== '' && hash !== '#table-of-contents')
    {
        setVisible(hash);
        setActive(hash);
    }
};

/*
When the page loads, set the correct element visible on screen & set correct nav element active
 */
window.onload = function(){
    // init();
    // const hash = document.location.hash;
    // if (hash !== '')
    // {
    //     setVisible(hash);
    //     setActive(hash);
    // }
};

/*
When the screen is scrolled, set the correct active lesson in nav
 */
document.addEventListener("scroll", function(){
    /*
    All existing lessons in actual chapter on screen
     */
    let lessons = document.querySelectorAll(".chapter--visible .chapter__lesson");
    /*
    The lesson considered "visible" on screen
     */
    let visibleLesson = findVisibleElement(lessons);

    if (visibleLesson != null) // set to "active" the corresponding lesson in nav
    {
        let visibleLessonTitle = document.querySelector("#"+visibleLesson.id+" > h3");
        setActive("#"+visibleLessonTitle.id);
    }
    else // if there is no lesson "visible", unset "active" status from all lessons
    {
        let old = document.querySelector(".verticalNav__lesson--active");
        if (old != null)
            unsetActive(old.attributes["href"].nodeValue);

        //Check or uncheck visible status of chapter if screen is at the top
        let chapter = document.querySelector(".chapter--visible h2");
        let chapterLink = document.querySelector("a[href=\"" + "#"+chapter.id + "\"]")
        if (chapterLink != null && (isInViewport(chapter, false) || (window.scrollY > 30)))
            setActive("#"+chapter.id);
        else
            unsetActive("#"+chapter.id);
    }
}, {passive: true});

function init()
{
    /*
    Initialize the toggle of the nav
     */
    const nav = document.getElementById("table-of-contents");
    const textToc = tocText(document.documentElement.lang);
    const body = document.body;
    body.insertAdjacentHTML('afterbegin',
        '<div class="toggleNav">\n' +
        '    <a href="#table-of-contents" class="toggleNav__link" id="toggleNav__link"></a>\n' +
        '    <h2 class="toggleNav__title">' + textToc + '</h2>\n' +
        '</div>'
    );
    const toggleNavLink = document.getElementById("toggleNav__link");
    toggleNavLink.addEventListener("click", function() {
        if (document.location.hash === toggleNavLink.attributes["href"].nodeValue)
            closeLink();
        else
            setActive(document.location.hash);
    })

    /*
    Initialize the close element of the nav
     */
    const title = document.querySelector("#table-of-contents h2");
    title.insertAdjacentHTML('beforeend',
        '<a href="#" class="verticalNav__close"><img src="theme/personal/src/cross.svg" alt="Close"></a>');

    /*
    Initialize the nav
     */
    nav.classList.add("verticalNav");
    const list = document.querySelector("#text-table-of-contents > ul");
    list.classList.add("verticalNav__list");
    const navChapters = document.querySelectorAll(".verticalNav__list > li > a");
    navChapters.forEach((chapter) => {
        chapter.classList.add("verticalNav__chapter");
    });
    const listLevel2 = document.querySelectorAll(".verticalNav li > ul");
    listLevel2.forEach((el) => {
       el.classList.add("verticalNav__list__level2");
    });
    const navLessons = document.querySelectorAll(".verticalNav__list__level2 a");
    navLessons.forEach((el) => {
       el.classList.add("verticalNav__lesson");
    });

    /*
    Initialize the chapters
     */
    const chapters = document.querySelectorAll("div.outline-2");
    chapters[0].classList.add("chapter--visible");
    chapters.forEach((el)=>{
       el.classList.add("chapter");
    });
    /*
    Initialize the lessons
     */
    const lessons = document.querySelectorAll("div.outline-3");
    lessons.forEach((el)=>{
       el.classList.add("chapter__lesson");
    });
}

function tocText(lang) {
    switch (lang) {
        case 'fr': return "Table des matières";
        case 'en': return "Table of contents";
    }
}

function closeLink()
{
    document.location.href = "";
}

/**
 * Get the first visible element of a collection in viewport
 * @param {HTMLCollection} elements the list of elements to test
 * @returns {null|HTMLElement} the visible element
 */
function findVisibleElement(elements)
{
    if (elements == null)
        return null;
    for (let i = 0; i < elements.length; i++)
        if (isInViewport(elements[i], false))
            return (elements[i]);
    return null;
}

/**
 * Test if an element is visible in viewport
 * @param {HTMLElement} element the element to test
 * @param {boolean} fullyInView true if the element has to be completely visible, false otherwise
 * @returns {boolean} true if the element is visible, false otherwise
 */
function isInViewport(element, fullyInView)
{
    /*
    the actual position in viewport of the element
     */
    const rect = element.getBoundingClientRect();

    if (fullyInView) // test if the element is fully visible in viewport (we use innerHeigt & clientHeight for compatibility)
    {
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    return (
        (rect.top <= 20 && rect.bottom >= 0)
    ); // test if the element is partially visible in viewport

    /*
    Determine if element is truly visible

    return (
        (rect.top >= 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight)) ||
        (rect.top < 0 && rect.bottom >= 0)
    );
     */
}

/**
 * Remove "visible" modifier from all chapters
 */
function removeChaptersVisible()
{
    let visible = document.querySelectorAll(".chapter--visible");
    visible.forEach((el) => {
        el.classList.remove("chapter--visible");
    })
}

/**
 * Set the correct chapter visible
 * @param {string} anchor the anchor of the chapter to set to "visible"
 */
function setVisible(anchor)
{
    /*
    chapter element corresponding to the address set
     */
    let anchorTitle = document.querySelector(anchor);
    let parentAnchor = anchorTitle.parentElement;

    if (parentAnchor.classList.contains("chapter") && !parentAnchor.classList.contains("chapter--visible"))
    {
        removeChaptersVisible();
        parentAnchor.classList.add("chapter--visible");
        anchorTitle.scrollIntoView();
        // window.scroll(0,0);
    }
    else if (parentAnchor.classList.contains("chapter__lesson") && !parentAnchor.parentElement.parentElement.classList.contains("chapter--visible"))
    {
        removeChaptersVisible();
        // el.parentElement.parentElement.classList.add("chapter--visible");
        parentAnchor.parentElement.classList.add("chapter--visible");
        anchorTitle.scrollIntoView();
    }
}

/**
 * unset the "active" modifier of the link pointing to anchor
 * @param {string} anchor the pointing anchor of the link
 */
function unsetActive(anchor)
{
    /*
    the link pointing to the anchor
     */
    let el = document.querySelector("a[href=\""+anchor+"\"]");
    if (el != null)
        el.classList.remove("verticalNav__chapter--active", "verticalNav__lesson--active");
}

/**
 * Set the "active" modifier of the link pointing to the anchor
 * @param {string} anchor the pointing anchor of the link
 */
function setActive(anchor)
{
    /*
    active link(s) before another link was clicked
     */
    let oldActives = document.querySelectorAll(".verticalNav__chapter--active:not([href=\""+anchor+"\"]), .verticalNav__lesson--active");
    /*
    new active link(s)
     */
    let newActive = document.querySelector("a[href=\""+anchor+"\"]");

    if (newActive != null)
    {
        if (oldActives != null) // delete active modifier of old active link(s)
            oldActives.forEach((el) => {
                if (el !== newActive.parentElement.parentElement.parentElement.children[0])
                    unsetActive(el.attributes["href"].nodeValue);
            })

        if (newActive.className === "verticalNav__lesson") // if it's a lesson link, set the corresponding chapter to active
        {
            newActive.classList.add("verticalNav__lesson--active");
            let chapters = document.querySelectorAll(".verticalNav__chapter");
            let stop = false;
            newActive.parentElement.parentElement.parentElement.children[0].classList.add("verticalNav__chapter--active");
            // for (let i = 0; i < chapters.length && !stop; i++)
                // if (newActive.attributes["href"].nodeValue.includes(chapters[i].attributes["href"].nodeValue))
                // {
                //     chapters[i].classList.add("verticalNav__chapter--active");
                //     stop = true;
                // }
        }
        else  // else, just set the chapter to active & show lessons
            newActive.classList.add("verticalNav__chapter--active");

    }
}
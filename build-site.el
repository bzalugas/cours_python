;;; build-site.el --- Build script for the website -*- lexical-binding: t; -*-
;;
;; Copyright (C) 2022 bzalugas
;;
;; Author: bzalugas <bastien.zalugas@hotmail.fr>
;; Maintainer: bzalugas <bastien.zalugas@hotmail.fr>
;; Created: août 18, 2022
;; Modified: août 18, 2022
;; Version: 0.0.1
;; Keywords: abbrev bib c calendar comm convenience data docs emulations extensions faces files frames games hardware help hypermedia i18n internal languages lisp local maint mail matching mouse multimedia news outlines processes terminals tex tools unix vc wp
;; Homepage: https://github.com/bastien/build-site
;; Package-Requires: ((emacs "24.4"))
;;
;; This file is not part of GNU Emacs.
;;
;;; Commentary:
;;
;;  Description
;;
;;; Code:

;; Load the publishing system
(provide 'build-site)
(require 'ox-publish)

;; Set package installation directory so that packages aren't stored in the ~/.emacs.d/elpa path
(require 'package)
(setq package-user-dir (expand-file-name "./.packages"))
(setq package-archives '(("melpa" . "https://melpa.org/packages/")
			 ("elpa" . "https://elpa.gnu.org/packages/")))

;; Initialize the package system
(package-initialize)
(unless package-archive-contents
  (package-refresh-contents))

;; Install dependencies
(package-install 'htmlize)

;; Define the publishing project
(setq org-publish-project-alist ;; projects to publish
      (list
       (list "cours_python"
             :recursive t ;; look recursively in base-directory folder
             :base-directory "./content" ;; base directory (org files)
             :publishing-directory "./public" ;; publishing directory (html files)
             :publishing-function 'org-html-publish-to-html ;; function to use to publish
             :with-author nil ;; don't include author's name
             :with-creator nil ;; don't include emacs & org versions in footer
             :with-toc t ;; include table of contents
             :section-numbers nil ;; don't include section numbers
             :time-stamp-file nil ;; don't include time stamp in file
             )))

;; Customization of HTML output
(setq org-html-validation-link nil ;; don't include valiadation link
      org-html-head-include-scripts nil ;; use our own scripts
      org-html-head-include-default-style nil ;; use our own styles
      org-html-head "<link rel=\"stylesheet\" href=\"https://cdn.simplecss.org/simple.css\">" ;; stylesheet
      )

;; Generate the site output
(org-publish-all t)

(message "Build complete !")


;;; build-site.el ends here

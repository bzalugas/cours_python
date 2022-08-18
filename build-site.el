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

;; Define the publishing project
(setq org-publish-project-alist
      (list
       (list "cours_python"
             :recursive t
             :base-directory "./content"
             :publishing-directory "./public"
             :publishing-function 'org-html-publish-to-html
             :with-author nil
             :with-creator nil
             :with-toc t
             :section-numbers nil
             :time-stamp-file nil)))
(setq org-html-validation-link nil)

;; Generate the site output
(org-publish-all t)

(message "Build complete !")


;;; build-site.el ends here

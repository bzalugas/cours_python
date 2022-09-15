;;; build-site.el --- Description -*- lexical-binding: t; -*-
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

;; Define the publishing projects
(setq org-publish-project-alist
      '(
	("org-notes"
	 :recursive t ;; look recursively in base-directory folder
	 :base-directory "./content" ;; base directory (org files)
	 :base-extension "org" ;; extensions we want to be taken
	 :publishing-directory "./public" ;; publishing directory (html files)
	 :publishing-function org-html-publish-to-html ;; function to use to publish
	 )

	("org-static"
	 :recursive t ;; look recursively in base-directory folder
	 :base-directory "./content" ;; base directory (org files)
	 :base-extension "css\\|js\\|png\\|jpg\\|gif\\|pdf\\|mp3\\|ogg\\|swf\\|svg" ;; extensions we want to be taken
	 :publishing-directory "./public" ;; publishing directory (html files)
	 :publishing-function org-publish-attachment ;; function to use to publish
	 )

	("org-site" :components ("org-notes" "org-static")))) ;; Components to use to to build an "org-site"

;; Customization of HTML output
(setq org-html-validation-link nil) ;; don't include valiadation link

;; Generate the site output
(org-publish "org-site" t)
(message "Build complete !")


(provide 'build-site)
;;; build-site.el ends here

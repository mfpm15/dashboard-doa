export interface AccessibilityIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriteria: string;
  element: string;
  description: string;
  recommendation: string;
  autoFixable: boolean;
  xpath?: string;
  selector?: string;
}

export interface AccessibilityReport {
  timestamp: number;
  url: string;
  totalIssues: number;
  errors: number;
  warnings: number;
  infos: number;
  score: number; // 0-100
  wcagCompliance: {
    A: boolean;
    AA: boolean;
    AAA: boolean;
  };
  issues: AccessibilityIssue[];
  summary: {
    keyboardNavigation: boolean;
    colorContrast: boolean;
    altText: boolean;
    headingStructure: boolean;
    focusManagement: boolean;
    ariaLabels: boolean;
  };
}

export class AccessibilityAuditor {
  private issues: AccessibilityIssue[] = [];
  private elements: NodeListOf<Element> | null = null;

  /**
   * Run comprehensive accessibility audit
   */
  async audit(): Promise<AccessibilityReport> {
    console.log('Starting accessibility audit...');

    this.issues = [];
    this.elements = document.querySelectorAll('*');

    // Run all audit checks
    await Promise.all([
      this.checkKeyboardNavigation(),
      this.checkColorContrast(),
      this.checkAltText(),
      this.checkHeadingStructure(),
      this.checkFocusManagement(),
      this.checkAriaLabels(),
      this.checkFormLabels(),
      this.checkLandmarks(),
      this.checkTextContent(),
      this.checkInteractiveElements(),
      this.checkSemanticHTML(),
      this.checkLanguage(),
      this.checkAnimationPreferences()
    ]);

    return this.generateReport();
  }

  /**
   * Check keyboard navigation
   */
  private async checkKeyboardNavigation(): Promise<void> {
    // Check for focusable elements without proper tab order
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );

    const elementsWithoutTabIndex = Array.from(focusableElements).filter(
      (element) => {
        const tabIndex = element.getAttribute('tabindex');
        return tabIndex && parseInt(tabIndex) > 0;
      }
    );

    if (elementsWithoutTabIndex.length > 0) {
      this.addIssue({
        id: 'keyboard-nav-tabindex',
        severity: 'warning',
        wcagLevel: 'A',
        wcagCriteria: '2.1.1',
        element: 'Various elements',
        description: 'Elements have positive tabindex values',
        recommendation: 'Use tabindex="0" or natural tab order instead of positive values',
        autoFixable: true
      });
    }

    // Check for keyboard traps
    const modals = document.querySelectorAll('[role="dialog"], .modal');
    modals.forEach((modal, index) => {
      if (modal.classList.contains('active') || modal.getAttribute('aria-hidden') === 'false') {
        const focusableInModal = modal.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableInModal.length === 0) {
          this.addIssue({
            id: `keyboard-trap-${index}`,
            severity: 'error',
            wcagLevel: 'A',
            wcagCriteria: '2.1.2',
            element: modal.tagName.toLowerCase(),
            description: 'Modal dialog has no focusable elements',
            recommendation: 'Ensure modals contain focusable elements and manage focus properly',
            autoFixable: false,
            selector: this.getSelector(modal)
          });
        }
      }
    });

    // Check for skip links
    const skipLinks = document.querySelectorAll('a[href^="#main"], a[href^="#content"]');
    if (skipLinks.length === 0) {
      this.addIssue({
        id: 'skip-links-missing',
        severity: 'warning',
        wcagLevel: 'A',
        wcagCriteria: '2.4.1',
        element: 'document',
        description: 'No skip links found',
        recommendation: 'Add skip links to main content for keyboard users',
        autoFixable: true
      });
    }
  }

  /**
   * Check color contrast
   */
  private async checkColorContrast(): Promise<void> {
    const textElements = document.querySelectorAll('p, span, a, button, label, h1, h2, h3, h4, h5, h6');

    for (const element of textElements) {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      const fontSize = parseFloat(styles.fontSize);

      if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const contrastRatio = this.calculateContrastRatio(color, backgroundColor);
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && styles.fontWeight === 'bold');

        const minContrast = isLargeText ? 3 : 4.5;
        const aaContrast = isLargeText ? 4.5 : 7;

        if (contrastRatio < minContrast) {
          this.addIssue({
            id: `contrast-${this.getSelector(element)}`,
            severity: 'error',
            wcagLevel: 'AA',
            wcagCriteria: '1.4.3',
            element: element.tagName.toLowerCase(),
            description: `Insufficient color contrast: ${contrastRatio.toFixed(2)}:1`,
            recommendation: `Increase contrast to at least ${minContrast}:1 (current: ${contrastRatio.toFixed(2)}:1)`,
            autoFixable: false,
            selector: this.getSelector(element)
          });
        } else if (contrastRatio < aaContrast) {
          this.addIssue({
            id: `contrast-aaa-${this.getSelector(element)}`,
            severity: 'info',
            wcagLevel: 'AAA',
            wcagCriteria: '1.4.6',
            element: element.tagName.toLowerCase(),
            description: `Color contrast could be improved: ${contrastRatio.toFixed(2)}:1`,
            recommendation: `Consider increasing contrast to ${aaContrast}:1 for AAA compliance`,
            autoFixable: false,
            selector: this.getSelector(element)
          });
        }
      }
    }
  }

  /**
   * Check alt text for images
   */
  private async checkAltText(): Promise<void> {
    const images = document.querySelectorAll('img');

    images.forEach((img, index) => {
      const alt = img.getAttribute('alt');
      const ariaLabel = img.getAttribute('aria-label');
      const ariaLabelledby = img.getAttribute('aria-labelledby');
      const role = img.getAttribute('role');

      // Skip decorative images
      if (role === 'presentation' || alt === '') {
        return;
      }

      if (!alt && !ariaLabel && !ariaLabelledby) {
        this.addIssue({
          id: `alt-text-missing-${index}`,
          severity: 'error',
          wcagLevel: 'A',
          wcagCriteria: '1.1.1',
          element: 'img',
          description: 'Image missing alternative text',
          recommendation: 'Add descriptive alt text or mark as decorative',
          autoFixable: false,
          selector: this.getSelector(img)
        });
      } else if (alt && (alt.length < 3 || alt.includes('image') || alt.includes('picture'))) {
        this.addIssue({
          id: `alt-text-poor-${index}`,
          severity: 'warning',
          wcagLevel: 'A',
          wcagCriteria: '1.1.1',
          element: 'img',
          description: 'Image has poor quality alt text',
          recommendation: 'Improve alt text to be more descriptive and meaningful',
          autoFixable: false,
          selector: this.getSelector(img)
        });
      }
    });
  }

  /**
   * Check heading structure
   */
  private async checkHeadingStructure(): Promise<void> {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels: number[] = [];

    // Check for H1
    const h1s = document.querySelectorAll('h1');
    if (h1s.length === 0) {
      this.addIssue({
        id: 'no-h1',
        severity: 'error',
        wcagLevel: 'A',
        wcagCriteria: '1.3.1',
        element: 'document',
        description: 'No H1 heading found',
        recommendation: 'Add an H1 heading to the page',
        autoFixable: false
      });
    } else if (h1s.length > 1) {
      this.addIssue({
        id: 'multiple-h1',
        severity: 'warning',
        wcagLevel: 'A',
        wcagCriteria: '1.3.1',
        element: 'h1',
        description: 'Multiple H1 headings found',
        recommendation: 'Use only one H1 per page',
        autoFixable: false
      });
    }

    // Check heading hierarchy
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      headingLevels.push(level);
    });

    for (let i = 1; i < headingLevels.length; i++) {
      const current = headingLevels[i];
      const previous = headingLevels[i - 1];

      if (current > previous + 1) {
        this.addIssue({
          id: `heading-skip-${i}`,
          severity: 'warning',
          wcagLevel: 'A',
          wcagCriteria: '1.3.1',
          element: `h${current}`,
          description: `Heading level skipped from H${previous} to H${current}`,
          recommendation: 'Use sequential heading levels without skipping',
          autoFixable: false
        });
      }
    }

    // Check for empty headings
    headings.forEach((heading, index) => {
      if (!heading.textContent?.trim()) {
        this.addIssue({
          id: `empty-heading-${index}`,
          severity: 'error',
          wcagLevel: 'A',
          wcagCriteria: '1.3.1',
          element: heading.tagName.toLowerCase(),
          description: 'Empty heading found',
          recommendation: 'Add meaningful text to the heading or remove it',
          autoFixable: false,
          selector: this.getSelector(heading)
        });
      }
    });
  }

  /**
   * Check focus management
   */
  private async checkFocusManagement(): Promise<void> {
    // Check for focus indicators
    // This would need to be enhanced with actual CSS inspection
    // For now, we'll check for common focus indicator removal
    const stylesheets = Array.from(document.styleSheets);
    let hasFocusRemoval = false;

    try {
      for (const stylesheet of stylesheets) {
        if (stylesheet.cssRules) {
          for (const rule of stylesheet.cssRules) {
            if (rule instanceof CSSStyleRule) {
              if (rule.selectorText?.includes(':focus') &&
                  rule.style.outline === 'none' &&
                  !rule.style.boxShadow &&
                  !rule.style.border) {
                hasFocusRemoval = true;
                break;
              }
            }
          }
        }
      }
    } catch {
      // CSS access might be restricted for external stylesheets
    }

    if (hasFocusRemoval) {
      this.addIssue({
        id: 'focus-indicator-removed',
        severity: 'error',
        wcagLevel: 'A',
        wcagCriteria: '2.4.7',
        element: 'CSS',
        description: 'Focus indicators have been removed without providing alternatives',
        recommendation: 'Ensure visible focus indicators are always present',
        autoFixable: false
      });
    }

    // Check for autofocus
    const autofocusElements = document.querySelectorAll('[autofocus]');
    if (autofocusElements.length > 0) {
      this.addIssue({
        id: 'autofocus-present',
        severity: 'warning',
        wcagLevel: 'A',
        wcagCriteria: '3.2.1',
        element: 'input',
        description: 'Autofocus attribute found',
        recommendation: 'Avoid autofocus as it can be disorienting for screen reader users',
        autoFixable: true
      });
    }
  }

  /**
   * Check ARIA labels and roles
   */
  private async checkAriaLabels(): Promise<void> {
    // Check for elements with invalid ARIA roles
    const elementsWithRoles = document.querySelectorAll('[role]');
    const validRoles = [
      'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
      'checkbox', 'columnheader', 'combobox', 'dialog', 'document', 'group',
      'heading', 'img', 'link', 'list', 'listbox', 'listitem', 'main',
      'menu', 'menubar', 'menuitem', 'navigation', 'option', 'presentation',
      'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup',
      'rowheader', 'scrollbar', 'search', 'separator', 'slider', 'spinbutton',
      'status', 'tab', 'tablist', 'tabpanel', 'textbox', 'timer', 'toolbar',
      'tooltip', 'tree', 'treeitem'
    ];

    elementsWithRoles.forEach((element, index) => {
      const role = element.getAttribute('role');
      if (role && !validRoles.includes(role)) {
        this.addIssue({
          id: `invalid-aria-role-${index}`,
          severity: 'error',
          wcagLevel: 'A',
          wcagCriteria: '4.1.2',
          element: element.tagName.toLowerCase(),
          description: `Invalid ARIA role: ${role}`,
          recommendation: 'Use a valid ARIA role or remove the role attribute',
          autoFixable: false,
          selector: this.getSelector(element)
        });
      }
    });

    // Check for aria-labelledby references
    const labelledbyElements = document.querySelectorAll('[aria-labelledby]');
    labelledbyElements.forEach((element, index) => {
      const labelledby = element.getAttribute('aria-labelledby');
      if (labelledby) {
        const referencedElement = document.getElementById(labelledby);
        if (!referencedElement) {
          this.addIssue({
            id: `aria-labelledby-invalid-${index}`,
            severity: 'error',
            wcagLevel: 'A',
            wcagCriteria: '4.1.2',
            element: element.tagName.toLowerCase(),
            description: `aria-labelledby references non-existent element: ${labelledby}`,
            recommendation: 'Ensure aria-labelledby references an existing element ID',
            autoFixable: false,
            selector: this.getSelector(element)
          });
        }
      }
    });

    // Check for aria-describedby references
    const describedbyElements = document.querySelectorAll('[aria-describedby]');
    describedbyElements.forEach((element, index) => {
      const describedby = element.getAttribute('aria-describedby');
      if (describedby) {
        const referencedElement = document.getElementById(describedby);
        if (!referencedElement) {
          this.addIssue({
            id: `aria-describedby-invalid-${index}`,
            severity: 'error',
            wcagLevel: 'A',
            wcagCriteria: '4.1.2',
            element: element.tagName.toLowerCase(),
            description: `aria-describedby references non-existent element: ${describedby}`,
            recommendation: 'Ensure aria-describedby references an existing element ID',
            autoFixable: false,
            selector: this.getSelector(element)
          });
        }
      }
    });
  }

  /**
   * Check form labels
   */
  private async checkFormLabels(): Promise<void> {
    const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea, select');

    inputs.forEach((input, index) => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledby = input.getAttribute('aria-labelledby');
      const placeholder = input.getAttribute('placeholder');

      if (!label && !ariaLabel && !ariaLabelledby) {
        this.addIssue({
          id: `form-label-missing-${index}`,
          severity: 'error',
          wcagLevel: 'A',
          wcagCriteria: '1.3.1',
          element: input.tagName.toLowerCase(),
          description: 'Form control missing label',
          recommendation: 'Add a label element, aria-label, or aria-labelledby attribute',
          autoFixable: false,
          selector: this.getSelector(input)
        });
      }

      // Check for placeholder-only labels
      if (!label && !ariaLabel && !ariaLabelledby && placeholder) {
        this.addIssue({
          id: `placeholder-only-label-${index}`,
          severity: 'warning',
          wcagLevel: 'A',
          wcagCriteria: '1.3.1',
          element: input.tagName.toLowerCase(),
          description: 'Form control uses only placeholder text as label',
          recommendation: 'Provide a proper label in addition to placeholder text',
          autoFixable: false,
          selector: this.getSelector(input)
        });
      }
    });
  }

  /**
   * Check for landmarks
   */
  private async checkLandmarks(): Promise<void> {
    const main = document.querySelectorAll('main, [role="main"]');

    if (main.length === 0) {
      this.addIssue({
        id: 'main-landmark-missing',
        severity: 'warning',
        wcagLevel: 'A',
        wcagCriteria: '1.3.1',
        element: 'document',
        description: 'No main landmark found',
        recommendation: 'Add a main element or role="main" to identify the main content',
        autoFixable: true
      });
    }

    if (main.length > 1) {
      this.addIssue({
        id: 'multiple-main-landmarks',
        severity: 'error',
        wcagLevel: 'A',
        wcagCriteria: '1.3.1',
        element: 'main',
        description: 'Multiple main landmarks found',
        recommendation: 'Use only one main landmark per page',
        autoFixable: false
      });
    }
  }

  /**
   * Check text content issues
   */
  private async checkTextContent(): Promise<void> {
    // Check for very small text
    const textElements = document.querySelectorAll('p, span, div, a, button, label');

    textElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element);
      const fontSize = parseFloat(styles.fontSize);

      if (fontSize < 12) {
        this.addIssue({
          id: `text-too-small-${index}`,
          severity: 'warning',
          wcagLevel: 'AA',
          wcagCriteria: '1.4.4',
          element: element.tagName.toLowerCase(),
          description: `Text size too small: ${fontSize}px`,
          recommendation: 'Use at least 12px font size for better readability',
          autoFixable: false,
          selector: this.getSelector(element)
        });
      }
    });

    // Check for justified text
    textElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element);
      if (styles.textAlign === 'justify') {
        this.addIssue({
          id: `justified-text-${index}`,
          severity: 'info',
          wcagLevel: 'AAA',
          wcagCriteria: '1.4.8',
          element: element.tagName.toLowerCase(),
          description: 'Text is justified',
          recommendation: 'Consider using left-aligned text for better readability',
          autoFixable: true,
          selector: this.getSelector(element)
        });
      }
    });
  }

  /**
   * Check interactive elements
   */
  private async checkInteractiveElements(): Promise<void> {
    // Check button text
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
      const text = button.textContent?.trim();
      const ariaLabel = button.getAttribute('aria-label');

      if (!text && !ariaLabel) {
        this.addIssue({
          id: `button-no-text-${index}`,
          severity: 'error',
          wcagLevel: 'A',
          wcagCriteria: '4.1.2',
          element: 'button',
          description: 'Button has no accessible text',
          recommendation: 'Add text content or aria-label to the button',
          autoFixable: false,
          selector: this.getSelector(button)
        });
      } else if (text && text.length < 2) {
        this.addIssue({
          id: `button-text-too-short-${index}`,
          severity: 'warning',
          wcagLevel: 'A',
          wcagCriteria: '2.4.6',
          element: 'button',
          description: 'Button text is too short to be descriptive',
          recommendation: 'Use more descriptive button text',
          autoFixable: false,
          selector: this.getSelector(button)
        });
      }
    });

    // Check link text
    const links = document.querySelectorAll('a[href]');
    links.forEach((link, index) => {
      const text = link.textContent?.trim();
      const ariaLabel = link.getAttribute('aria-label');

      if (!text && !ariaLabel) {
        this.addIssue({
          id: `link-no-text-${index}`,
          severity: 'error',
          wcagLevel: 'A',
          wcagCriteria: '2.4.4',
          element: 'a',
          description: 'Link has no accessible text',
          recommendation: 'Add text content or aria-label to the link',
          autoFixable: false,
          selector: this.getSelector(link)
        });
      } else if (text && ['click here', 'read more', 'here', 'more'].includes(text.toLowerCase())) {
        this.addIssue({
          id: `link-text-generic-${index}`,
          severity: 'warning',
          wcagLevel: 'A',
          wcagCriteria: '2.4.4',
          element: 'a',
          description: 'Link text is not descriptive',
          recommendation: 'Use more descriptive link text that explains the destination',
          autoFixable: false,
          selector: this.getSelector(link)
        });
      }
    });
  }

  /**
   * Check semantic HTML usage
   */
  private async checkSemanticHTML(): Promise<void> {
    // Check for divs used instead of semantic elements
    const clickableDivs = document.querySelectorAll('div[onclick], div[role="button"]');
    clickableDivs.forEach((div, index) => {
      this.addIssue({
        id: `div-as-button-${index}`,
        severity: 'warning',
        wcagLevel: 'A',
        wcagCriteria: '4.1.2',
        element: 'div',
        description: 'Div element used as interactive control',
        recommendation: 'Use button element instead of div for interactive controls',
        autoFixable: false,
        selector: this.getSelector(div)
      });
    });

    // Check for list structure
    const listItems = document.querySelectorAll('li');
    listItems.forEach((li, index) => {
      const parent = li.parentElement;
      if (parent && !['ul', 'ol', 'menu'].includes(parent.tagName.toLowerCase())) {
        this.addIssue({
          id: `li-outside-list-${index}`,
          severity: 'error',
          wcagLevel: 'A',
          wcagCriteria: '1.3.1',
          element: 'li',
          description: 'List item not contained in list element',
          recommendation: 'Wrap list items in ul, ol, or menu elements',
          autoFixable: false,
          selector: this.getSelector(li)
        });
      }
    });
  }

  /**
   * Check language declarations
   */
  private async checkLanguage(): Promise<void> {
    const html = document.documentElement;
    const lang = html.getAttribute('lang');

    if (!lang) {
      this.addIssue({
        id: 'lang-missing',
        severity: 'error',
        wcagLevel: 'A',
        wcagCriteria: '3.1.1',
        element: 'html',
        description: 'Page language not declared',
        recommendation: 'Add lang attribute to html element',
        autoFixable: true
      });
    } else if (lang.length < 2) {
      this.addIssue({
        id: 'lang-invalid',
        severity: 'error',
        wcagLevel: 'A',
        wcagCriteria: '3.1.1',
        element: 'html',
        description: 'Invalid language code',
        recommendation: 'Use valid ISO language code (e.g., "en", "id")',
        autoFixable: false
      });
    }
  }

  /**
   * Check animation and motion preferences
   */
  private async checkAnimationPreferences(): Promise<void> {
    // Check for animations without respecting prefers-reduced-motion
    const animatedElements = document.querySelectorAll('[style*="animation"], [style*="transition"]');

    if (animatedElements.length > 0) {
      this.addIssue({
        id: 'animation-no-preference-check',
        severity: 'info',
        wcagLevel: 'AAA',
        wcagCriteria: '2.3.3',
        element: 'Various',
        description: 'Animations present without checking motion preferences',
        recommendation: 'Respect prefers-reduced-motion media query for accessibility',
        autoFixable: false
      });
    }
  }

  /**
   * Generate final accessibility report
   */
  private generateReport(): AccessibilityReport {
    const errors = this.issues.filter(issue => issue.severity === 'error').length;
    const warnings = this.issues.filter(issue => issue.severity === 'warning').length;
    const infos = this.issues.filter(issue => issue.severity === 'info').length;

    // Calculate score (100 - weighted penalties)
    const score = Math.max(0, 100 - (errors * 10) - (warnings * 5) - (infos * 1));

    // Determine WCAG compliance
    const levelAIssues = this.issues.filter(issue => issue.wcagLevel === 'A' && issue.severity === 'error');
    const levelAAIssues = this.issues.filter(issue => issue.wcagLevel === 'AA' && issue.severity === 'error');
    const levelAAAIssues = this.issues.filter(issue => issue.wcagLevel === 'AAA' && issue.severity === 'error');

    return {
      timestamp: Date.now(),
      url: window.location.href,
      totalIssues: this.issues.length,
      errors,
      warnings,
      infos,
      score,
      wcagCompliance: {
        A: levelAIssues.length === 0,
        AA: levelAIssues.length === 0 && levelAAIssues.length === 0,
        AAA: levelAIssues.length === 0 && levelAAIssues.length === 0 && levelAAAIssues.length === 0
      },
      issues: this.issues,
      summary: {
        keyboardNavigation: !this.issues.some(i => i.id.includes('keyboard')),
        colorContrast: !this.issues.some(i => i.id.includes('contrast')),
        altText: !this.issues.some(i => i.id.includes('alt-text')),
        headingStructure: !this.issues.some(i => i.id.includes('heading')),
        focusManagement: !this.issues.some(i => i.id.includes('focus')),
        ariaLabels: !this.issues.some(i => i.id.includes('aria'))
      }
    };
  }

  /**
   * Add issue to the list
   */
  private addIssue(issue: Omit<AccessibilityIssue, 'id'> & { id: string }): void {
    this.issues.push(issue as AccessibilityIssue);
  }

  /**
   * Calculate color contrast ratio
   */
  private calculateContrastRatio(foreground: string, background: string): number {
    const fg = this.parseColor(foreground);
    const bg = this.parseColor(background);

    const fgLuminance = this.getLuminance(fg.r, fg.g, fg.b);
    const bgLuminance = this.getLuminance(bg.r, bg.g, bg.b);

    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Parse color string to RGB values
   */
  private parseColor(color: string): { r: number; g: number; b: number } {
    // Create a temporary element to get computed color
    const temp = document.createElement('div');
    temp.style.color = color;
    document.body.appendChild(temp);
    const computed = window.getComputedStyle(temp).color;
    document.body.removeChild(temp);

    const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3])
      };
    }

    return { r: 0, g: 0, b: 0 };
  }

  /**
   * Calculate relative luminance
   */
  private getLuminance(r: number, g: number, b: number): number {
    const rs = r / 255;
    const gs = g / 255;
    const bs = b / 255;

    const rLin = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    const gLin = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    const bLin = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);

    return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
  }

  /**
   * Generate CSS selector for an element
   */
  private getSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className) {
      const classes = Array.from(element.classList).join('.');
      return `${element.tagName.toLowerCase()}.${classes}`;
    }

    let path = element.tagName.toLowerCase();
    let parent = element.parentElement;

    while (parent) {
      const siblings = Array.from(parent.children);
      const index = siblings.indexOf(element);
      if (index > 0) {
        path = `${parent.tagName.toLowerCase()} > ${path}:nth-child(${index + 1})`;
      } else {
        path = `${parent.tagName.toLowerCase()} > ${path}`;
      }
      element = parent;
      parent = parent.parentElement;
    }

    return path;
  }

  /**
   * Auto-fix issues where possible
   */
  async autoFix(): Promise<number> {
    let fixedCount = 0;

    for (const issue of this.issues) {
      if (!issue.autoFixable) continue;

      try {
        switch (issue.id) {
          case 'lang-missing':
            document.documentElement.setAttribute('lang', 'id');
            fixedCount++;
            break;

          case 'keyboard-nav-tabindex':
            const positiveTabIndexElements = document.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])');
            positiveTabIndexElements.forEach(el => {
              el.setAttribute('tabindex', '0');
            });
            fixedCount++;
            break;

          case 'skip-links-missing':
            const skipLink = document.createElement('a');
            skipLink.href = '#main';
            skipLink.textContent = 'Skip to main content';
            skipLink.className = 'sr-only focus:not-sr-only';
            document.body.insertBefore(skipLink, document.body.firstChild);
            fixedCount++;
            break;

          case 'main-landmark-missing':
            const mainContent = document.querySelector('#main, .main, .content');
            if (mainContent) {
              (mainContent as HTMLElement).setAttribute('role', 'main');
            }
            fixedCount++;
            break;

          default:
            // Issue cannot be auto-fixed
            break;
        }
      } catch (error) {
        console.error(`Failed to auto-fix issue ${issue.id}:`, error);
      }
    }

    return fixedCount;
  }

  /**
   * Export report as JSON
   */
  exportReport(report: AccessibilityReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(report: AccessibilityReport): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Audit Report</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; line-height: 1.6; }
        .header { border-bottom: 2px solid #e5e5e5; padding-bottom: 1rem; margin-bottom: 2rem; }
        .score { font-size: 2rem; font-weight: bold; color: ${report.score >= 80 ? '#10b981' : report.score >= 60 ? '#f59e0b' : '#ef4444'}; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
        .metric { padding: 1rem; border: 1px solid #e5e5e5; border-radius: 8px; }
        .issues { margin-top: 2rem; }
        .issue { margin: 1rem 0; padding: 1rem; border-left: 4px solid #e5e5e5; }
        .error { border-left-color: #ef4444; background: #fef2f2; }
        .warning { border-left-color: #f59e0b; background: #fffbeb; }
        .info { border-left-color: #3b82f6; background: #eff6ff; }
        .wcag { display: inline-block; padding: 0.25rem 0.5rem; background: #f3f4f6; border-radius: 4px; font-size: 0.75rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Accessibility Audit Report</h1>
        <p>URL: ${report.url}</p>
        <p>Generated: ${new Date(report.timestamp).toLocaleString()}</p>
        <div class="score">${report.score}/100</div>
    </div>

    <div class="summary">
        <div class="metric">
            <h3>Total Issues</h3>
            <div>${report.totalIssues}</div>
        </div>
        <div class="metric">
            <h3>Errors</h3>
            <div style="color: #ef4444;">${report.errors}</div>
        </div>
        <div class="metric">
            <h3>Warnings</h3>
            <div style="color: #f59e0b;">${report.warnings}</div>
        </div>
        <div class="metric">
            <h3>Info</h3>
            <div style="color: #3b82f6;">${report.infos}</div>
        </div>
    </div>

    <div class="wcag-compliance">
        <h2>WCAG Compliance</h2>
        <p>Level A: ${report.wcagCompliance.A ? '✅ Pass' : '❌ Fail'}</p>
        <p>Level AA: ${report.wcagCompliance.AA ? '✅ Pass' : '❌ Fail'}</p>
        <p>Level AAA: ${report.wcagCompliance.AAA ? '✅ Pass' : '❌ Fail'}</p>
    </div>

    <div class="issues">
        <h2>Issues</h2>
        ${report.issues.map(issue => `
            <div class="issue ${issue.severity}">
                <h3>${issue.description}</h3>
                <p><strong>Element:</strong> ${issue.element}</p>
                <p><strong>WCAG:</strong> <span class="wcag">${issue.wcagLevel} - ${issue.wcagCriteria}</span></p>
                <p><strong>Recommendation:</strong> ${issue.recommendation}</p>
                ${issue.selector ? `<p><strong>Selector:</strong> <code>${issue.selector}</code></p>` : ''}
                <p><strong>Auto-fixable:</strong> ${issue.autoFixable ? 'Yes' : 'No'}</p>
            </div>
        `).join('')}
    </div>
</body>
</html>
    `;
  }
}

// Export singleton instance
export const accessibilityAuditor = new AccessibilityAuditor();

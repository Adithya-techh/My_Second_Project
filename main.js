/**
 * ============================================================================
 * MAIN.JS - UI Interactions, AI Terminal, Contact Form & Event Handlers
 * ============================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTerminal();
    initContactForm();
    initCopyEmail();
    initSkillObserver();
  });

  /* --------------------------------------------------------------------------
     1. NAVIGATION & MOBILE MENU
     -------------------------------------------------------------------------- */
  function initNavigation() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const isOpen = navLinks.classList.contains('open');
        mobileBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
      });

      // Close mobile menu on clicking any link
      links.forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
      });
    }
  }

  /* --------------------------------------------------------------------------
     2. INTERACTIVE RETRO AI TERMINAL
     -------------------------------------------------------------------------- */
  function initTerminal() {
    const termInput = document.getElementById('terminal-input');
    const termOutput = document.getElementById('terminal-output');
    const termBody = document.getElementById('terminal-body');
    const clearBtn = document.getElementById('term-clear-btn');
    const cmdChips = document.querySelectorAll('.term-cmd-btn');

    if (!termInput || !termOutput) return;

    // Command History
    const history = [];
    let historyIndex = -1;

    // Available Commands & Handlers
    const commands = {
      help: () => `
<span class="term-cyan">Available Commands:</span>
  • <span class="term-green">about</span>     - Summary of Adithya's background & focus
  • <span class="term-green">skills</span>    - List of core languages & tech stack
  • <span class="term-green">projects</span>  - Highlights of featured creations
  • <span class="term-green">contact</span>   - Get Adithya's contact info
  • <span class="term-green">socials</span>   - Links to GitHub, LinkedIn, Twitter
  • <span class="term-green">quote</span>     - Random inspirational programming quote
  • <span class="term-green">matrix</span>    - Trigger digital matrix stream
  • <span class="term-green">whoami</span>    - Display current user & system permissions
  • <span class="term-green">date</span>      - Show current date & system time
  • <span class="term-green">clear</span>     - Clear the terminal screen`,

      about: () => `
<span class="term-purple">Name:</span> Adithya
<span class="term-purple">Role:</span> Computer Science Student & Aspiring AI Engineer
<span class="term-purple">Passion:</span> 3D Web Experiences (Three.js), Python AI, and Clean Code
<span class="term-purple">Philosophy:</span> "Learn deeply by building interactive, real-world projects."`,

      skills: () => `
<span class="term-cyan">Frontend & 3D:</span>  HTML5, CSS3, JavaScript ES6+, Three.js, WebGL
<span class="term-purple">Backend & AI:</span>   Python, Machine Learning fundamentals, REST APIs
<span class="term-green">Tools & Dev:</span>     Git, GitHub, VS Code, PowerShell, Terminal`,

      projects: () => `
<span class="term-yellow">1. 3D AI Student Portfolio:</span> WebGL Three.js interactive portfolio with real-time avatar
<span class="term-yellow">2. Smart AI Study Assistant:</span> Note summarizer & quiz generator for students
<span class="term-yellow">3. Interactive Algorithm Visualizer:</span> Step-by-step sorting & search visualizer
<span class="term-yellow">4. Focus Task Planner:</span> Modern Pomodoro & goal tracker web app`,

      contact: () => `
<span class="term-green">Email:</span> adithya@example.com
<span class="term-green">Status:</span> Open for internships, hackathons & project collaborations!
<span class="term-green">Form:</span> Scroll down to the contact section or type your message there.`,

      socials: () => `
<span class="term-cyan">GitHub:</span>   https://github.com
<span class="term-cyan">LinkedIn:</span> https://linkedin.com
<span class="term-cyan">Twitter:</span>  https://twitter.com
<span class="term-cyan">Discord:</span>  adithya#0001`,

      quote: () => {
        const quotes = [
          `"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." – Martin Fowler`,
          `"First, solve the problem. Then, write the code." – John Johnson`,
          `"Simplicity is prerequisite for reliability." – Edsger W. Dijkstra`,
          `"The secret of getting ahead is getting started." – Mark Twain`
        ];
        return `<span class="term-purple">${quotes[Math.floor(Math.random() * quotes.length)]}</span>`;
      },

      whoami: () => `<span class="term-green">guest@adithya: Access Level [VISITOR_AUTHORIZED]</span>`,

      date: () => `<span class="term-yellow">${new Date().toLocaleString()}</span>`,

      matrix: () => {
        let matrixChars = '';
        for (let i = 0; i < 4; i++) {
          let line = '';
          for (let j = 0; j < 36; j++) {
            line += Math.random() > 0.5 ? '1 ' : '0 ';
          }
          matrixChars += line + '<br/>';
        }
        return `<span class="term-green">${matrixChars}Wake up, Neo... Adithya is coding the Matrix.</span>`;
      },

      sudo: () => `<span class="term-cyan">Nice try! Permission denied: Adithya is the superuser here :)</span>`
    };

    function executeCommand(rawInput) {
      const input = rawInput.trim();
      if (!input) return;

      // Add to history
      history.push(input);
      historyIndex = history.length;

      // Create command echo element
      const cmdLine = document.createElement('div');
      cmdLine.className = 'term-line';
      cmdLine.innerHTML = `<span class="term-prompt">visitor@adithya:~$</span> <span class="term-cyan">${escapeHTML(input)}</span>`;
      termOutput.appendChild(cmdLine);

      // Process command
      const [cmd, ...args] = input.toLowerCase().split(' ');

      if (cmd === 'clear') {
        termOutput.innerHTML = '';
      } else if (commands[cmd]) {
        const response = commands[cmd](args);
        const resLine = document.createElement('div');
        resLine.className = 'term-line';
        resLine.innerHTML = response;
        termOutput.appendChild(resLine);
      } else {
        const errLine = document.createElement('div');
        errLine.className = 'term-line';
        errLine.innerHTML = `<span style="color: #ff5f56;">Command not found: '${escapeHTML(cmd)}'. Type <span class="term-cyan">'help'</span> for a list of valid commands.</span>`;
        termOutput.appendChild(errLine);
      }

      // Auto scroll to bottom of terminal
      termBody.scrollTop = termBody.scrollHeight;
    }

    // Input Keydown (Enter, Up, Down)
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = termInput.value;
        termInput.value = '';
        executeCommand(val);
      } else if (e.key === 'ArrowUp') {
        if (history.length > 0 && historyIndex > 0) {
          historyIndex--;
          termInput.value = history[historyIndex];
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < history.length - 1) {
          historyIndex++;
          termInput.value = history[historyIndex];
        } else {
          historyIndex = history.length;
          termInput.value = '';
        }
        e.preventDefault();
      }
    });

    // Clear Button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        termOutput.innerHTML = '';
      });
    }

    // Quick Command Buttons
    cmdChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          termInput.value = '';
          executeCommand(cmd);
          termInput.focus();
        }
      });
    });

    // Focus input on clicking anywhere in terminal body
    termBody.addEventListener('click', () => {
      termInput.focus();
    });
  }

  /* --------------------------------------------------------------------------
     3. CONTACT FORM WITH CONFETTI & FEEDBACK
     -------------------------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const feedback = document.getElementById('form-feedback');

    if (!form || !submitBtn) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value;

      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      // Button loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Message...</span>';
      submitBtn.disabled = true;

      // Simulate sending delay
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Message Sent!</span>';
        submitBtn.disabled = false;

        // Trigger celebratory confetti
        if (window.confetti) {
          window.confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.7 }
          });
        }

        // Show feedback
        if (feedback) {
          feedback.innerHTML = `🎉 Thank you, <strong>${escapeHTML(name)}</strong>! Your message has been sent. Adithya will respond soon!`;
          feedback.className = 'form-feedback success';
          feedback.classList.remove('hidden');
        }

        // Reset form
        form.reset();

        // Revert button after 3 seconds
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
        }, 4000);
      }, 1000);
    });
  }

  /* --------------------------------------------------------------------------
     4. 1-CLICK EMAIL COPY TO CLIPBOARD
     -------------------------------------------------------------------------- */
  function initCopyEmail() {
    const copyBtn = document.getElementById('copy-email-btn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
      const emailText = 'adithya@example.com';
      navigator.clipboard.writeText(emailText).then(() => {
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check text-green"></i> <span>Copied!</span>';
        copyBtn.classList.add('btn-primary');

        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
          copyBtn.classList.remove('btn-primary');
        }, 2500);
      }).catch(() => {
        alert('Email: ' + emailText);
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. SKILL BAR ANIMATIONS (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  function initSkillObserver() {
    const skillBars = document.querySelectorAll('.progress-fill');
    if (!skillBars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetWidth = entry.target.style.width;
          entry.target.style.width = '0%';
          setTimeout(() => {
            entry.target.style.width = targetWidth;
          }, 100);
        }
      });
    }, { threshold: 0.2 });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      observer.observe(skillsSection);
    }
  }

  /* Helper function to escape HTML */
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
})();

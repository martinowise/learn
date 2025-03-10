/**
 * Tooltip-Utility für das Rechtschreibspiel
 */

// Speichert aktive Timeouts und Tooltips
const tooltipTimers = new Map();
const tooltipElements = new Map();
let baseZIndex = 1000;

/**
 * Berechnet die beste Position für einen Tooltip
 * @param {HTMLElement} targetElement - Element, an dem der Tooltip angezeigt wird
 * @param {HTMLElement} tooltipElement - Der Tooltip selbst
 * @returns {Object} - Position und Offset-Informationen
 */
function calculateTooltipPosition(targetElement, tooltipElement) {
    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Vertikalen Platz prüfen
    const spaceAbove = targetRect.top;
    const spaceBelow = windowHeight - targetRect.bottom;
    const position = spaceAbove > tooltipRect.height ? 'top' : 'bottom';

    // Horizontalen Offset berechnen
    let offsetX = 0;
    const tooltipLeft = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
    const tooltipRight = tooltipLeft + tooltipRect.width;

    if (tooltipLeft < 10) {
        offsetX = 10 - tooltipLeft;
    } else if (tooltipRight > windowWidth - 10) {
        offsetX = windowWidth - 10 - tooltipRight;
    }

    return { position, offsetX };
}

/**
 * Zeigt einen Tooltip an einem Element an
 * @param {HTMLElement} element - Element, an dem der Tooltip angezeigt wird
 * @param {String} message - Anzuzeigender Text
 * @param {String} type - 'success', 'error', oder 'info'
 * @param {Object} options - Zusätzliche Optionen
 */
function showTooltip(element, message, type = 'info', options = {}) {
    // Standard-Optionen
    const defaultOptions = {
        duration: 2000,         // Tooltip-Anzeigedauer in ms
        autoClose: true,        // Automatisch schließen?
        animation: true,        // Animieren?
        closeOthers: true       // Andere Tooltips schließen?
    };
    
    // Optionen kombinieren
    const settings = { ...defaultOptions, ...options };
    
    // Globalen Click-Handler aktivieren, falls noch nicht geschehen
    setupGlobalClickHandler();
    
    // Bestehenden Timer löschen
    if (tooltipTimers.has(element)) {
        clearTimeout(tooltipTimers.get(element));
        tooltipTimers.delete(element);
    }
    
    // Existierenden Tooltip entfernen
    if (tooltipElements.has(element)) {
        const oldTooltip = tooltipElements.get(element);
        if (oldTooltip && oldTooltip.parentNode) {
            oldTooltip.parentNode.removeChild(oldTooltip);
        }
        tooltipElements.delete(element);
    }
    
    // Andere Tooltips schließen wenn gewünscht
    if (settings.closeOthers) {
        tooltipElements.forEach((tooltip, el) => {
            if (el !== element && tooltip && tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
                tooltipElements.delete(el);
                if (tooltipTimers.has(el)) {
                    clearTimeout(tooltipTimers.get(el));
                    tooltipTimers.delete(el);
                }
            }
        });
    }
    
    // Tooltip erstellen
    const tooltip = document.createElement('span');
    tooltip.className = 'word-tooltip';
    tooltip.textContent = message;
    
    // Typ-spezifische Klasse hinzufügen
    switch (type) {
        case 'success':
            tooltip.classList.add('tooltip-success');
            break;
        case 'error':
            tooltip.classList.add('tooltip-error');
            break;
        default:
            tooltip.classList.add('tooltip-info');
    }
    
    // Pfeil hinzufügen
    const arrow = document.createElement('span');
    arrow.className = 'tooltip-arrow';
    tooltip.appendChild(arrow);
    
    // Z-Index erhöhen
    baseZIndex++;
    tooltip.style.zIndex = baseZIndex;
    
    // Tooltip zum Element hinzufügen
    element.style.position = element.style.position || 'relative';
    element.appendChild(tooltip);
    tooltipElements.set(element, tooltip);
    
    // Position berechnen und anwenden
    requestAnimationFrame(() => {
        const { position, offsetX } = calculateTooltipPosition(element, tooltip);
        
        tooltip.classList.add(`tooltip-${position}`);
        tooltip.style.transform = `translateX(calc(-50% + ${offsetX}px))`;
        
        // Pfeil-Position anpassen
        arrow.classList.add(`arrow-${position}`);
        
        // Animation starten
        if (settings.animation) {
            tooltip.classList.add('tooltip-show');
        }
    });
    
    // Auto-Close Timer starten wenn gewünscht
    if (settings.autoClose) {
        const timer = setTimeout(() => {
            hideTooltip(element);
        }, settings.duration);
        tooltipTimers.set(element, timer);
    }
    
    return tooltip;
}

/**
 * Tooltip ausblenden
 * @param {HTMLElement} element - Element, an dem der Tooltip angezeigt wird
 */
function hideTooltip(element) {
    const tooltip = tooltipElements.get(element);
    if (!tooltip) return;
    
    // Animation für das Ausblenden
    tooltip.classList.remove('tooltip-show');
    tooltip.classList.add('tooltip-hide');
    
    // Nach der Animation entfernen
    setTimeout(() => {
        if (tooltip && tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
        tooltipElements.delete(element);
    }, 200); // Dauer der CSS-Transition
    
    // Timer löschen
    if (tooltipTimers.has(element)) {
        clearTimeout(tooltipTimers.get(element));
        tooltipTimers.delete(element);
    }
}

/**
 * Tooltip sofort entfernen ohne Animation
 * @param {HTMLElement} element - Element, an dem der Tooltip angezeigt wird
 */
function removeTooltip(element) {
    const tooltip = tooltipElements.get(element);
    if (tooltip && tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
    }
    tooltipElements.delete(element);
    
    if (tooltipTimers.has(element)) {
        clearTimeout(tooltipTimers.get(element));
        tooltipTimers.delete(element);
    }
}

/**
 * Globalen Click-Handler einrichten um Tooltips zu schließen
 */
let globalHandlerSetup = false;
function setupGlobalClickHandler() {
    if (globalHandlerSetup) return;
    
    document.addEventListener('click', (event) => {
        let insideTooltip = false;
        tooltipElements.forEach((tooltip, element) => {
            if (element.contains(event.target)) {
                insideTooltip = true;
            }
        });
        
        if (!insideTooltip) {
            tooltipElements.forEach((tooltip, element) => {
                hideTooltip(element);
            });
        }
    });
    
    globalHandlerSetup = true;
}

// CSS-Styles für Tooltips einfügen
function injectTooltipStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .word-tooltip {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            white-space: nowrap;
            pointer-events: none;
            color: white;
            opacity: 0;
            transition: opacity 0.2s ease, transform 0.2s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            z-index: 1000;
        }
        
        .tooltip-show {
            opacity: 1;
        }
        
        .tooltip-hide {
            opacity: 0;
        }
        
        .tooltip-top {
            bottom: 100%;
            margin-bottom: 8px;
        }
        
        .tooltip-bottom {
            top: 100%;
            margin-top: 8px;
        }
        
        .tooltip-arrow {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
        }
        
        .arrow-top {
            bottom: -10px;
            border-top-color: inherit;
            border-bottom: none;
        }
        
        .arrow-bottom {
            top: -10px;
            border-bottom-color: inherit;
            border-top: none;
        }
        
        .tooltip-success {
            background-color: #28a745;
            border-color: #28a745;
        }
        
        .tooltip-error {
            background-color: #dc3545;
            border-color: #dc3545;
        }
        
        .tooltip-info {
            background-color: #17a2b8;
            border-color: #17a2b8;
        }
    `;
    document.head.appendChild(styleEl);
}

// Styles automatisch einfügen, wenn das Skript geladen wird
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectTooltipStyles);
    } else {
        injectTooltipStyles();
    }
}
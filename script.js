(function ($) {
   'use strict';

   var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   var speed = reduceMotion ? 0 : 250;

   $(function () {
      var $tiles = $('.pt-table > section.pt-element');
      var $guides = $('.pt-filter-hide .pt-color-guide');
      var $desc = $('.pt-element-desc .pt-filter-info');
      var $reset = $('#pt-reset');
      var $search = $('#pt-real-search');
      var $rows = $('#pt-search-table > li');
      var $modal = $('#element-modal');

      $('body').addClass('is-loaded');

      var allGroups = '.g1, .g2, .g3, .g4, .g5, .g6, .g7, .g8, .g9, .g10, .g11, .g12, .g13, .g14, .g15, .g16, .g17, .g18';
      var allPeriods = '.p1, .p2, .p3, .p4, .p5, .p6, .p7';
      var allStates = '.pt-gas, .pt-liquid, .pt-solid, .pt-unknown';

      var FILTERS = {
         'cg-all': { selector: '', panel: '', title: 'Explore the elements', text: 'Select a filter above, search below, or click any element to see its full details.' },
         'cg-metals': { selector: '.pt-alkali, .pt-alkaline, .pt-transition, .pt-basic, .pt-post-transition, .pt-lanthanide, .pt-actinide', panel: '.pt-filter-metal', title: 'Metals', text: 'Metals are shiny, conduct heat and electricity, and make up most of the periodic table.' },
         'cg-metalloids': { selector: '.pt-metalloids', panel: '', title: 'Metalloids', text: 'Metalloids have properties between metals and nonmetals, making them useful semiconductors.' },
         'cg-nonmetals': { selector: '.pt-nonmetal, .pt-halogen, .pt-noble', panel: '.pt-filter-nonmetal', title: 'Nonmetals', text: 'Nonmetals are poor conductors and include the reactive halogens and the stable noble gases.' },
         'cg-states': { selector: allStates, panel: '.pt-filter-states', title: 'States at room temperature', text: 'Most elements are solids. Only mercury and bromine are liquids, while eleven are gases.' },
         'cg-groups': { selector: allGroups, panel: '.pt-filter-groups', title: 'Groups', text: 'Groups are the vertical columns. Elements in a group share the same number of valence electrons.' },
         'cg-periods': { selector: allPeriods, panel: '.pt-filter-periods', title: 'Periods', text: 'Periods are the horizontal rows. Elements in a period have the same number of electron shells.' },
         'cg-alkali': { selector: '.pt-alkali', title: 'Alkali metals', text: 'Group 1 metals are soft, highly reactive, and form alkaline solutions in water.' },
         'cg-alkaline': { selector: '.pt-alkaline', title: 'Alkaline earth metals', text: 'Group 2 metals are reactive but less so than the alkali metals.' },
         'cg-transition': { selector: '.pt-transition', title: 'Transition metals', text: 'Found in the centre of the table, these metals form coloured compounds and are excellent catalysts.' },
         'cg-post-transition': { selector: '.pt-post-transition', title: 'Post-transition metals', text: 'These metals are softer and have lower melting points than the transition metals.' },
         'cg-lanthanide': { selector: '.pt-lanthanide', title: 'Lanthanides', text: 'The 15 metallic elements from lanthanum to lutetium are also called the rare earth elements.' },
         'cg-actinide': { selector: '.pt-actinide', title: 'Actinides', text: 'The actinide series runs from actinium to lawrencium and includes the radioactive elements.' },
         'cg-nonmetal': { selector: '.pt-nonmetal', title: 'Nonmetals', text: 'Nonmetals gain or share electrons when they react and are mostly gases or brittle solids.' },
         'cg-halogen': { selector: '.pt-halogen', title: 'Halogens', text: 'Group 17 elements are reactive nonmetals that form salts when they react with metals.' },
         'cg-noble': { selector: '.pt-noble', title: 'Noble gases', text: 'Group 18 gases have full outer shells, which makes them very unreactive.' },
         'cg-gas': { selector: '.pt-gas', title: 'Gases', text: 'Eleven elements are gases at room temperature, including hydrogen, oxygen and the noble gases.' },
         'cg-liquid': { selector: '.pt-liquid', title: 'Liquids', text: 'Only two elements are liquid at room temperature: mercury and bromine.' },
         'cg-solid': { selector: '.pt-solid', title: 'Solids', text: 'The majority of elements are solids at room temperature.' },
         'cg-unknown': { selector: '.pt-unknown', title: 'Unknown state', text: 'The physical state of these synthetic, super-heavy elements has not been confirmed.' }
      };

      allGroups.split(', ').forEach(function (selector, index) {
         FILTERS['cg-g' + (index + 1)] = { selector: selector, title: 'Group ' + (index + 1), text: 'Elements in group ' + (index + 1) + ' share the same number of valence electrons.' };
      });
      allPeriods.split(', ').forEach(function (selector, index) {
         FILTERS['cg-p' + (index + 1)] = { selector: selector, title: 'Period ' + (index + 1), text: 'Elements in period ' + (index + 1) + ' have their electrons arranged in ' + (index + 1) + ' shell' + (index === 0 ? '' : 's') + '.' };
      });

      function setFilter(id) {
         var config = FILTERS[id];
         if (!config) return;

         $('.pt-group-filter, .pt-color-guide').removeClass('pt-active');
         $('#' + id).addClass('pt-active');
         $guides.hide();
         if (config.panel) $guides.filter(config.panel).css('display', 'inline-block');

         $reset.toggle(id !== 'cg-all');
         $tiles.removeClass('pt-selected pt-not-selected');

         if (config.selector) {
            var $matches = $tiles.filter(config.selector);
            $tiles.not(config.selector).addClass('pt-not-selected');
            $matches.addClass('pt-selected');
         }

         var count = config.selector ? $tiles.filter(config.selector).length : $tiles.length;
         $desc.empty();
         $('<h2>').text(config.title).appendTo($desc);
         $('<p>').text(config.text).appendTo($desc);
         $('<span class="pt-filter-count">').text(count + (count === 1 ? ' element' : ' elements')).appendTo($desc);
      }

      $(document).on('click', '.pt-group-filter, .pt-color-guide', function () {
         setFilter(this.id);
      });
      $reset.on('click', function () { setFilter('cg-all'); });

      function searchElements() {
         var query = $.trim($search.val()).toLowerCase();
         var shown = 0;

         $rows.each(function () {
            var match = !query || $(this).text().toLowerCase().indexOf(query) !== -1;
            $(this).toggle(match);
            if (match) shown += 1;
            $(this).find('.pt-toggle').attr('aria-expanded', 'false');
            if (!match) $(this).find('.pt-inner').removeClass('pt-show').hide();
         });

         $('#pt-search-count').text(query ? shown + (shown === 1 ? ' result' : ' results') : '');
         $('#pt-search-empty').prop('hidden', !query || shown > 0);
      }

      $search.on('input', searchElements);
      $('#pt-search-clear').on('click', function () {
         $search.val('');
         searchElements();
         $search.trigger('focus');
      });

      function toggleRow($toggle) {
         var $row = $toggle.closest('li');
         var $inner = $row.find('.pt-inner');
         var isOpen = $inner.hasClass('pt-show');

         $rows.find('.pt-inner').removeClass('pt-show').stop(true, true).slideUp(speed);
         $rows.find('.pt-toggle').attr('aria-expanded', 'false');

         if (!isOpen) {
            $inner.addClass('pt-show').stop(true, true).slideDown(speed);
            $toggle.attr('aria-expanded', 'true');
         }
      }

      $('#pt-search-table').on('click', '.pt-toggle', function (event) {
         event.preventDefault();
         toggleRow($(this));
      });
      $('#pt-search-table').on('keydown', '.pt-toggle', function (event) {
         if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleRow($(this));
         }
      });

      function buildLearnLinks($detail) {
         var symbol = $detail.find('.pt-element-symbol').first().text().trim();
         var $tile = $detail.find('section.pt-element').first();
         var quiz = { label: 'All chemistry quizzes', url: 'https://edvibe.co.ke/quizzes.php' };

         if (symbol === 'N') quiz = { label: 'Nitrogen quiz', url: 'https://edvibe.co.ke/quiz.php?slug=nitrogen-and-its-compounds-80' };
         if (symbol === 'S') quiz = { label: 'Sulphur quiz', url: 'https://edvibe.co.ke/quiz.php?slug=sulphur-and-its-compounds-81' };
         if (['C', 'H', 'O'].indexOf(symbol) !== -1) quiz = { label: 'Organic chemistry quiz', url: 'https://edvibe.co.ke/quiz.php?slug=organic-chemistry-ii' };
         if ($tile.hasClass('pt-actinide') || ['Tc', 'Pm'].indexOf(symbol) !== -1) quiz = { label: 'Radioactivity quiz', url: 'https://edvibe.co.ke/quiz.php?slug=radioactivity' };

         var links = [
            quiz,
            { label: 'Chemistry notes', url: 'https://edvibe.co.ke/notes.php?subject=chemistry' }
         ];
         if (quiz.url !== 'https://edvibe.co.ke/quizzes.php') {
            links.push({ label: 'All chemistry quizzes', url: 'https://edvibe.co.ke/quizzes.php' });
         }

         var $wrap = $('<div class="modal-learn">');
         $('<h3>').text('Keep learning').appendTo($wrap);
         $('<p>').text('Take the next step with free Edvibe resources.').appendTo($wrap);
         var $list = $('<div class="modal-learn__links">').appendTo($wrap);

         links.forEach(function (link) {
            $('<a>', { href: link.url, target: '_blank', rel: 'noopener', text: link.label }).appendTo($list);
         });
         return $wrap;
      }

      function openModal($source) {
          var $content = $source.clone(true);
          $content.removeAttr('id').find('[id]').removeAttr('id');
          $content.addClass('modal-detail pt-show').css('display', 'block');
          $('#modal-body').empty().append($content).append(buildLearnLinks($source));
          $modal.addClass('is-open').attr('aria-hidden', 'false').stop(true, true).fadeIn(speed);
         $('body').addClass('modal-open');
         $modal.find('.modal-close').trigger('focus');
      }

      function closeModal() {
         if (!$modal.hasClass('is-open')) return;
          $modal.stop(true, true).fadeOut(speed);
         $modal.removeClass('is-open').attr('aria-hidden', 'true');
         $('body').removeClass('modal-open');
      }

      $('.pt-table').on('click', 'section.pt-element a[href^="#"]', function (event) {
         var $target = $($(this).attr('href'));
         if (!$target.length) return;
         event.preventDefault();
         openModal($target);
      });
      $modal.on('click', '.modal-close', closeModal);
      $modal.on('click', function (event) {
         if (event.target === this) closeModal();
      });
      $(document).on('keydown', function (event) {
         if (event.key === 'Escape') closeModal();
      });

      $('.pt-toggle-link, .pt-toggle-hide-link').on('click', function (event) {
         event.preventDefault();
         var showing = $(this).hasClass('pt-toggle-link');
         $('.pt-hide-content').stop(true, true)[showing ? 'slideDown' : 'slideUp'](speed);
         $('.pt-toggle-link, .pt-toggle-hide-link').toggleClass('pt-is-hidden', !showing);
         $('.pt-toggle-link').attr('aria-expanded', String(showing));
      });

      function updateBackToTop() {
         $('.pt-to-top').toggle($(window).scrollTop() > 300);
      }
      $(window).on('scroll', updateBackToTop);
      $('.pt-to-top').on('click', 'a', function (event) {
         event.preventDefault();
         window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });

      $('.hero__stats strong[data-count]').each(function () {
         var $counter = $(this);
         var target = parseInt($counter.attr('data-count'), 10);
         var start = performance.now();
         var duration = reduceMotion ? 0 : 1100;

         function tick(now) {
            var progress = duration ? Math.min((now - start) / duration, 1) : 1;
            $counter.text(Math.round(target * (1 - Math.pow(1 - progress, 3))));
            if (progress < 1) requestAnimationFrame(tick);
         }
         requestAnimationFrame(tick);
      });

      $tiles.each(function () {
         var $tile = $(this);
         var href = $tile.find('a').first().attr('href');
         var name = href ? $(href).find('.pt-element-name').first().text().trim() : '';
         if (name) $tile.attr('title', name);
      });

      var today = new Date();
      var dayNumber = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
      var $dailyTile = $tiles.eq(dayNumber % $tiles.length);
      var dailyHref = $dailyTile.find('a').first().attr('href');
      var $dailyDetail = $(dailyHref);
      var $dailyCard = $dailyTile.clone(true);
      $dailyCard.removeAttr('id').find('[id]').removeAttr('id').end().find('a').removeAttr('href');
      $('#eotd-tile').empty().append($dailyCard);
      $('#eotd-title').text($dailyDetail.find('.pt-element-name').first().text().trim());
      var dailyFact = $dailyDetail.find('.pt-col-desc').first().text().replace(/\s+/g, ' ').trim();
      $('#eotd-fact').text(dailyFact.length > 150 ? dailyFact.slice(0, 147).trim() + '…' : dailyFact);
      $('#eotd-open').on('click', function () { openModal($dailyDetail); });

      $('.hero__actions a[href="#periodic-table"]').on('click', function (event) {
         event.preventDefault();
         var $table = $('#periodic-table');
         $('html, body').stop(true).animate({ scrollTop: $table.offset().top - 84 }, reduceMotion ? 0 : 650);
         $table.addClass('pt-flash');
         window.setTimeout(function () { $table.removeClass('pt-flash'); }, 1200);
      });

      $('.hero__tile').on('click', function (event) {
         event.preventDefault();
         var href = $('#' + $(this).attr('data-element')).find('a').first().attr('href');
         if (href) openModal($(href));
      });

      $('#pt-random').on('click', function () {
         var $tile = $tiles.eq(Math.floor(Math.random() * $tiles.length));
         var href = $tile.find('a').first().attr('href');
         if (href) openModal($(href));
      });

      $(document).on('keydown', function (event) {
         var tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
         if (event.key === '/' && tag !== 'input' && tag !== 'textarea') {
            event.preventDefault();
            $search.trigger('focus');
         }
      });

      setFilter('cg-all');
      searchElements();
      updateBackToTop();
   });
})(jQuery);

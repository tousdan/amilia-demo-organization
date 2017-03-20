(function() {

  // Amilia API Helpers. Copyright 2016 Amilia.
  // https://github.com/AmiliaApp/amilia-demo-organization

  // Dependencies:
  //   - jQuery (https://jquery.com/)
  //   - Moment.js (http://momentjs.com/)
  //   - Underscore.js (http://underscorejs.org/)


  // Private
  var apiUrl = 'https://www.amilia.com/PublicApi/';
  var tableContentTemplate = _.template([
    '<table>',
    '<thead>',
    '  <tr>',
    '  <% _.each(labels, function(label) { %>',
    '    <th><%= label %></th>',
    '  <% }) %>',
    '  </tr>',
    '</thead>',
    '<tbody></tbody>',
    '</table>'
  ].join('\n'));

  function tagUrl(rewriteUrl, lang) {
    return apiUrl + '{RewriteUrl}/{Lang}/Tags'
      .replace('{RewriteUrl}', rewriteUrl)
      .replace('{Lang}', lang);
  }

  function activitesUrl(rewriteUrl, lang, tagId) {
    return apiUrl + '{RewriteUrl}/{Lang}/Tags/{Id}/Activities'
      .replace('{RewriteUrl}', rewriteUrl)
      .replace('{Lang}', lang)
      .replace('{Id}', tagId);
  }

  function programsUrl(rewriteUrl, lang) {
    return apiUrl + '{RewriteUrl}/{Lang}/Programs?archived=false&offline=false'
      .replace('{RewriteUrl}', rewriteUrl)
      .replace('{Lang}', lang);
  }

  function programActivitiesUrl(rewriteUrl, lang, programId) {
    return apiUrl + '{RewriteUrl}/{Lang}/Programs/{Id}/Activities?limit=5'
      .replace('{RewriteUrl}', rewriteUrl)
      .replace('{Lang}', lang)
      .replace('{Id}', programId);
  }

  function onError(error) {
    console.log(error);
  }

  function table(elem, labels) {
    elem.html(tableContentTemplate({ labels: labels }));
    return elem;
  }

  function renderTableOfActivities(activities, $table, isV1) {
    table($table, ['Name', 'Location', 'When', 'Price', 'Spots available']);

    var rowTemplate = _.template([
      '<tr>',
      '  <td><%=name%></td>',
      '  <td><%=location%></td>',
      '  <td><%=when%></td>',
      '  <td><%=price%></td>',
      '  <td><%=spots%></td>',
      '  <td><a href="<%=url%>" class="btn btn-primary btn-sm">Register</a></td>',
      '</tr>'
    ].join('\n'));

    var activitiesHTMLTableRows = _.map(activities, function(activity) {
      var timePeriod = isV1
        ? activity.Schedule.TimePeriod
        : activity.Schedule[0];

      var start = timePeriod.StartDate.replace('00:00:00', timePeriod.StartTime);

      var spots = isV1 ? activity.NbPlacesLeft : activity.SpotsRemaining;

      var hasUnlimitedSpots = isV1
        ? spots === 2147483639 || spots === null
        : spots === null;

      var data = {
        name: activity.Name,
        location: activity.Location || activity.LegacyLocation,
        when: moment(start).format('h:mm a'),
        price: activity.Price + ' $',
        spots: hasUnlimitedSpots ? 'no limit' : spots,
        url: activity.Url
      };

      return rowTemplate(data);
    });

    $table.find('tbody').append(activitiesHTMLTableRows);
  }

  function renderTableOfPrograms(programs, paging, $table) {
    table($table, ['Program', ' ']);

    var rowTemplate = _.template([
      '<tr>',
      '  <td><%= Name %></td>',
      '  <td><a class="btn btn-primary btn-sm" href="<%= Url %>">Store</a></td>',
      '</tr>'
    ].join('\n'));

    var body = $table.find('tbody');
    var programHTMLTableRows = programs.map(rowTemplate);

    body.append(programHTMLTableRows);
  }

  function renderProgramActivities(activities, paging, $table, $pager) {
    renderTableOfActivities(activities, $table, false);

    renderPager(paging, $pager, function(pageURL) {
      $.get(pageURL)
        .done(function(result) {
          activities = result.Items;
          paging = result.Page;

          renderProgramActivities(activities, paging, $table, $pager);
        });
    });
  }

  function renderPager(paging, $pager, nextPageCallback) {
    var pagerTemplate = _.template('<div><a class="btn btn-primary btn-sm" href="#" <% if (!Next) { %> disabled <% } %>>Next page</a></div>');  
    var pagerHtml = pagerTemplate(paging);

    $pager.html(pagerHtml);

    var nextPageUrl = paging && paging.Next;

    if (paging && paging.Next) {
      $pager.find('a').on('click', function(e) {
        e.preventDefault();
        nextPageCallback(nextPageUrl);
      });
    }
  }

  // Public function
  function buildActivitiesTable(rewriteUrl, lang, tagName, tableElement) {
    var $table = $(tableElement);
    if ($table.length === 0) return onError('Cannot find table element "' + tableElement + '"');

    $.get(tagUrl(rewriteUrl, lang))
      .done(function(tags) {
        var tag = _.findWhere(tags, { Name: tagName });
        if (!tag) return onError('Cannot find a tag named "' + tagName + '"');

        $.get(activitesUrl(rewriteUrl, lang, tag.Id))
          .done(function(activities) {
            renderTableOfActivities(activities, $table, true);
          })
          .fail(onError);
      })
      .fail(onError);
  }

  function buildProgramsTable(rewriteUrl, lang, tableElement) {
    var $table = $(tableElement);
    if ($table.length === 0) return onError('Cannot find table element "' + tableElement + '"');

    $.get(programsUrl(rewriteUrl, lang))
      .done(function(result) {
        var programs = result.Items;
        var paging = result.Page;

        renderTableOfPrograms(programs, paging, $table);
      });
  }

  function buildProgramActivitiesTable(rewriteUrl, lang, programId, tableElement, pagerElement) {
    var $table = $(tableElement);
    var $pager = $(pagerElement);

    if ($table.length === 0) return onError('Cannot find table element "' + tableElement + '"');
    if ($pager.length === 0) return onError('Cannot find table element "' + tableElement + '"');

    $.get(programActivitiesUrl(rewriteUrl, lang, programId))
      .done(function(result) {
        var activities = result.Items;
        var paging = result.Page;

        renderProgramActivities(activities, paging, $table, $pager);
      });
  }

  // Expose to global namespace
  window.AMILIA = {
    buildTable: buildActivitiesTable,
    buildActivitiesTable: buildActivitiesTable,
    buildProgramsTable: buildProgramsTable,
    buildProgramActivitiesTable: buildProgramActivitiesTable
  };
}).call(this);

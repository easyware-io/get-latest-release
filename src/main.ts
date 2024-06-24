import * as core from '@actions/core';
import * as github from '@actions/github';

const RELEASE_TYPE = {
  DRAFT: 'draft',
  PRERELEASE: 'prerelease',
  PUBLISHED: 'published',
};

export default async function run(): Promise<void> {
  try {
    core.debug('Getting owner and repo from context');
    const currentOwner = github.context.repo.owner;
    const currentRepo = github.context.repo.repo;

    core.debug('Getting inputs from the user');
    const token = core.getInput('token', { required: true });
    const owner = core.getInput('owner') || currentOwner;
    const repo = core.getInput('repo') || currentRepo;
    const excludes: string[] = core.getInput('excludes').trim().toLowerCase().split(',') || [];

    core.debug(`Creating Octokit instance with token: ${token}`);
    const octokit = github.getOctokit(token);

    const releasesRaw = await octokit.rest.repos.listReleases({
      owner,
      repo,
    });
    let releases = releasesRaw.data;

    core.info(`Found ${releases.length} releases`);
    core.info(`Excludes: ${excludes}`);
    core.info(`Releases: ${JSON.stringify(releases)}`);

    if (excludes.includes(RELEASE_TYPE.PUBLISHED)) {
      releases = releases.filter((x: { prerelease: boolean; draft: boolean }) => x.prerelease === true || x.draft === true);
    }
    if (excludes.includes(RELEASE_TYPE.PRERELEASE)) {
      releases = releases.filter((x: { prerelease: boolean }) => x.prerelease !== true);
    }
    if (excludes.includes(RELEASE_TYPE.DRAFT)) {
      releases = releases.filter((x: { draft: boolean }) => x.draft !== true);
    }

    let latestRelease = null;
    if (releases.length === 0) {
      core.error(`No release found.`);
      core.setFailed(`No release found.`);
    } else {
      latestRelease = releases[0];

      core.debug(`Setting outputs`);
      core.setOutput('id', latestRelease.id);
      core.setOutput('name', latestRelease.name);
      core.setOutput('tag_name', latestRelease.tag_name);
      core.setOutput('numeric_version', latestRelease.tag_name.replace('v', ''));
      core.setOutput('body', latestRelease.body);
      core.setOutput('draft', latestRelease.draft);
      core.setOutput('prerelease', latestRelease.prerelease);
      core.setOutput('created_at', latestRelease.created_at);
      core.setOutput('published_at', latestRelease.published_at);
      core.setOutput('url', latestRelease.url);
      core.setOutput('html_url', latestRelease.html_url);
      core.setOutput('assets_url', latestRelease.assets_url);
      core.setOutput('upload_url', latestRelease.upload_url);
      core.setOutput('tarball_url', latestRelease.tarball_url);
      core.setOutput('zipball_url', latestRelease.zipball_url);
      core.setOutput('node_id', latestRelease.node_id);
      core.setOutput('author_login', latestRelease.author.login);
      core.setOutput('author_id', latestRelease.author.id);
      core.setOutput('author_node_id', latestRelease.author.node_id);
      core.setOutput('author_avatar_url', latestRelease.author.avatar_url);
      core.setOutput('author_html_url', latestRelease.author.html_url);
      core.setOutput('author_followers_url', latestRelease.author.followers_url);
      core.setOutput('author_following_url', latestRelease.author.following_url);
      core.setOutput('author_gists_url', latestRelease.author.gists_url);
      core.setOutput('author_starred_url', latestRelease.author.starred_url);
      core.setOutput('author_subscriptions_url', latestRelease.author.subscriptions_url);
      core.setOutput('author_organizations_url', latestRelease.author.organizations_url);
      core.setOutput('author_repos_url', latestRelease.author.repos_url);
      core.setOutput('author_events_url', latestRelease.author.events_url);
      core.setOutput('author_received_events_url', latestRelease.author.received_events_url);
      core.setOutput('author_type', latestRelease.author.type);
      core.setOutput('author_site_admin', latestRelease.author.site_admin);
    }
  } catch (error) {
    core.setOutput('id', null);
    core.setOutput('name', null);
    core.setOutput('tag_name', null);
    core.setOutput('body', null);
    core.setOutput('draft', null);
    core.setOutput('prerelease', null);
    core.setOutput('created_at', null);
    core.setOutput('published_at', null);
    core.setOutput('url', null);
    core.setOutput('html_url', null);
    core.setOutput('assets_url', null);
    core.setOutput('upload_url', null);
    core.setOutput('tarball_url', null);
    core.setOutput('zipball_url', null);
    core.setOutput('node_id', null);
    core.setOutput('author_login', null);
    core.setOutput('author_id', null);
    core.setOutput('author_node_id', null);
    core.setOutput('author_avatar_url', null);
    core.setOutput('author_html_url', null);
    core.setOutput('author_followers_url', null);
    core.setOutput('author_following_url', null);
    core.setOutput('author_gists_url', null);
    core.setOutput('author_starred_url', null);
    core.setOutput('author_subscriptions_url', null);
    core.setOutput('author_organizations_url', null);
    core.setOutput('author_repos_url', null);
    core.setOutput('author_events_url', null);
    core.setOutput('author_received_events_url', null);
    core.setOutput('author_type', null);
    core.setOutput('author_site_admin', null);
    core.info(`Release not found.`);
  }
}

run();

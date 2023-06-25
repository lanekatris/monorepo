export function namesToMarkdown(names: string[]): string {
    return [
        '# Gym Users in the Last Week',
        '',
        `**Updated**: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        '',
        '| Name |',
        '| --- |',
        ...names.map(name => `| ${name} |`),
    ].join('\n')
}

require "coverage"

Coverage.start(lines: true)

at_exit do
  result = Coverage.result
  backend_root = File.expand_path("..", __dir__)
  tracked_files = Dir[File.join(backend_root, "app", "**", "*.rb")].sort

  coverage_failures = tracked_files.filter_map do |file|
    entry = result[file]
    lines = entry&.fetch(:lines, []) || []
    relevant = lines.compact.size
    covered = lines.count { |line| line.to_i.positive? }
    percentage = relevant.zero? ? 100.0 : ((covered.to_f / relevant) * 100).round(2)

    next if percentage >= 95.0

    format("%<file>s (%<percentage>.2f%%)", file: file.delete_prefix("#{backend_root}/"), percentage: percentage)
  end

  next if coverage_failures.empty?

  warn "Coverage check failed for:"
  coverage_failures.each { |failure| warn "  - #{failure}" }
  abort "Minimum line coverage by file is 95%"
end

RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end
end

namespace :openapi do
  desc "Generate the OpenAPI JSON document for the API"
  task generate: :environment do
    output_path = Rails.root.join("public/openapi.json")
    File.write(output_path, JSON.pretty_generate(OpenApiDocumentBuilder.call))
    puts "Wrote #{output_path}"
  end
end

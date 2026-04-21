class SeedEmployeesFromSeeds < ActiveRecord::Migration[8.1]
  def up
    return if Employee.exists?

    say_with_time "Seeding employees from db/seeds.rb" do
      Rails.application.load_seed
    end
  end

  def down
    raise ActiveRecord::IrreversibleMigration, "One-time seed migration cannot be reversed"
  end
end

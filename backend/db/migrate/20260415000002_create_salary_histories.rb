class CreateSalaryHistories < ActiveRecord::Migration[8.1]
  def change
    create_table :salary_histories do |t|
      t.references :employee, null: false, foreign_key: true
      t.decimal :previous_salary, precision: 12, scale: 2, null: false
      t.decimal :new_salary, precision: 12, scale: 2, null: false
      t.string :reason, null: false
      t.date :effective_date, null: false

      t.timestamps
    end
  end
end
